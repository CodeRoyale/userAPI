const googleAuth = require('google-auth-library');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const User = require('../models/user');

// secret keys and secret times
/* eslint-disable */
const [
  ACCESS_SECRECT_KEY,
  ACCESS_SECRECT_TIME,
  REFRESH_SECRECT_KEY,
  REFRESH_SECRECT_TIME,
  CLIENT_ID,
  FACEBOOK_APP_URL,
] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.ACCESS_SECRECT_TIME || secrets.ACCESS_SECRECT_TIME,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
  process.env.REFRESH_SECRECT_TIME || secrets.REFRESH_SECRECT_TIME,
  process.env.CLIENT_ID || secrets.CLIENT_ID,
  process.env.FACEBOOK_APP_URL || secrets.FACEBOOK_APP_URL,
];
/* eslint-enable */

// Using a Google API Client Library for verify idToken send by frontend
const { OAuth2Client } = googleAuth;
let thirdPartyData;
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
    idToken: thirdPartyData.access_token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // uncomment userid when it's in use
  // const userid = payload.sub;
  // TO LOG THE ERROR
  //   verify().catch(console.error);
  if (payload.aud !== CLIENT_ID) {
    throw new Error('Invalid token signature');
  } else {
    return payload;
  }
}

// signup
const signupUser = async (req, res) => {
  // more changes might come because we have to check for unique username too
  try {
    thirdPartyData = req.body;
    if (thirdPartyData.issuer === 'google') {
      verify()
        .then(async (data) => {
          await User.find({ email: data.email })
            .exec()
            /* eslint-disable consistent-return */
            .then((user) => {
              if (user.length >= 1) {
                return res.status(409).json({
                  message: 'User Already Exists',
                });
              }
              const newUser = new User({
                userName: data.given_name + data.iat,
                firstName: data.given_name,
                lastName: data.family_name,
                email: data.email,
                issuer: thirdPartyData.issuer,
                signUpType: thirdPartyData.signUpType,
                profilePic: {
                  public_id: data.sub,
                  url: data.picture,
                },
              });
              newUser
                .save()
                .then(() => {
                  res.status(201).json({
                    message: 'User Account Created',
                  });
                })
                .catch(() => {
                  res.status(401).json({
                    message: 'Required field missing or Username is in use',
                  });
                });
            })
            /* eslint-enable consistent-return */
            .catch((err) => {
              res.status(500).json({
                error: err,
              });
            });
        })
        .catch(() => {
          res.status(401).json({
            message: 'Invalid token signature',
          });
        });
    } else if (thirdPartyData.issuer === 'facebook') {
      const data = {
        access_token: req.body.access_token,
      };
      const url = FACEBOOK_APP_URL;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      await User.find({ email: result.user.email })
        .exec()
        /* eslint-disable consistent-return */
        .then((user) => {
          if (user.length >= 1) {
            return res.status(409).json({
              message: 'User Already Exists',
            });
          }
          const newUser = new User({
            userName: result.user.first_name + result.user.id,
            firstName: result.user.first_name,
            lastName: result.user.last_name,
            email: result.user.email,
            issuer: thirdPartyData.issuer,
            signUpType: thirdPartyData.signUpType,
            profilePic: {
              url: result.user.picture,
            },
          });
          newUser
            .save()
            .then(() => {
              res.status(201).json({
                message: 'User Account Created',
              });
            })
            .catch(() => {
              res.status(401).json({
                message: 'Required field missing or Username is in use',
              });
            });
        })
        /* eslint-enable consistent-return */
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      res.status(401).json({
        message: 'Unrecognized data !',
      });
    }
  } catch (err) {
    res.status(401).json({
      message: err.message,
    });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    thirdPartyData = req.body;

    if (thirdPartyData.issuer === 'google') {
      verify()
        .then(async (data) => {
          await User.find({ email: data.email })
            .exec()
            .then((user) => {
              if (user.length >= 1) {
                const accessToken = jwt.sign(
                  {
                    email: user[0].email,
                    userName: user[0].userName,
                  },
                  ACCESS_SECRECT_KEY,
                  {
                    expiresIn: ACCESS_SECRECT_TIME,
                  }
                );
                const refreshToken = jwt.sign(
                  {
                    email: user[0].email,
                    userName: user[0].userName,
                    name: user[0].name,
                  },
                  REFRESH_SECRECT_KEY,
                  {
                    expiresIn: REFRESH_SECRECT_TIME,
                  }
                );
                res.cookie('token', refreshToken, { httpOnly: true });
                res.status(200).json({
                  message: 'Login successful',
                  email: data.email,
                  userName: user[0].userName,
                  firstName: user[0].firstName,
                  lastName: user[0].lastName,
                  picture: data.picture,
                  accessToken: accessToken,
                });
              } else {
                res.status(401).json({
                  message: "User Doesn't Exists",
                });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: 'Server Error',
              });
            });
        })
        .catch(() => {
          res.status(401).json({
            message: 'Invalid token signature',
          });
        });
    } else if (thirdPartyData.issuer === 'facebook') {
      const data = {
        access_token: req.body.access_token,
      };
      const url = FACEBOOK_APP_URL;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      await User.find({ email: result.user.email })
        .exec()
        .then((user) => {
          if (user.length >= 1) {
            const accessToken = jwt.sign(
              {
                email: user[0].email,
                userName: user[0].userName,
              },
              ACCESS_SECRECT_KEY,
              {
                expiresIn: ACCESS_SECRECT_TIME,
              }
            );
            const refreshToken = jwt.sign(
              {
                email: user[0].email,
                userName: user[0].userName,
                name: user[0].name,
              },
              REFRESH_SECRECT_KEY,
              {
                expiresIn: REFRESH_SECRECT_TIME,
              }
            );
            res.cookie('token', refreshToken, { httpOnly: true });
            res.status(200).json({
              message: 'Login successful',
              email: result.user.email,
              userName: user[0].userName,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              picture: user[0].profilePic.url,
              accessToken: accessToken,
            });
          } else {
            res.status(401).json({
              message: "User Doesn't Exists",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: 'Server Error',
          });
        });
    } else {
      res.status(401).json({
        message: 'Unrecognized data !',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
};

// signout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// deleteUser
const deleteUser = async (req, res) => {
  try {
    // get the bearer token from headers
    const token = req.headers.authorization.split(' ')[1];
    // decode the token to get the data
    const decoded = jwt.decode(token, { complete: true });
    // data is stored is in playload
    const payloadData = decoded.payload;
    User.deleteOne({ userName: payloadData.userName })
      .exec()
      .then((data) => {
        console.log(data);
        if (data.n === 1) {
          res.status(200).json({
            message: 'Account deleted successfully',
          });
        } else {
          res.status(409).json({
            message: "Account dosen't exist",
          });
        }
      })
      .catch(() => {
        res.status(401).json({
          message: 'Account not found',
        });
      });
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
    });
  }
};

// getinfo
const getInfo = async (req, res) => {
  await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(200).json({
          email: user[0].email,
          userName: user[0].userName,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          picture: user[0].profilePic.url,
        });
      } else {
        res.status(401).json({
          message: "User Doesn't Exists",
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Server Error',
      });
    });
};

module.exports = { signupUser, loginUser, logoutUser, deleteUser, getInfo };
