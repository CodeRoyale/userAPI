const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const User = require('../models/user');
const { googleAuth } = require('../utils/googleAuth');
const RESPONSE = require('../utils/constantResponse');

// secret keys and secret times
/* eslint-disable */
const [
  ACCESS_SECRECT_KEY,
  ACCESS_SECRECT_TIME,
  REFRESH_SECRECT_KEY,
  REFRESH_SECRECT_TIME,
  FACEBOOK_APP_URL,
] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.ACCESS_SECRECT_TIME || secrets.ACCESS_SECRECT_TIME,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
  process.env.REFRESH_SECRECT_TIME || secrets.REFRESH_SECRECT_TIME,
  process.env.FACEBOOK_APP_URL || secrets.FACEBOOK_APP_URL,
];
/* eslint-enable */

function tokenGenerator(user) {
  const accToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.profilePic.url,
    },
    ACCESS_SECRECT_KEY,
    {
      expiresIn: ACCESS_SECRECT_TIME,
    }
  );
  const refToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
    },
    REFRESH_SECRECT_KEY,
    {
      expiresIn: REFRESH_SECRECT_TIME,
    }
  );
  return [accToken, refToken];
}

// signup
const signupUser = async (req, res) => {
  // more changes might come because we have to check for unique username too
  try {
    if (req.body.issuer === 'google') {
      googleAuth(req.body.access_token)
        .then(async (data) => {
          await User.find({ email: data.email })
            .exec()
            /* eslint-disable consistent-return */
            .then((user) => {
              if (user.length === 1) {
                return res.status(409).json({
                  status: true,
                  payload: {
                    message: RESPONSE.CONFLICT,
                  },
                });
              }
              const newUser = new User({
                userName: (data.given_name + data.iat).replace(/ /g, ''),
                firstName: data.given_name,
                lastName: data.family_name,
                email: data.email,
                issuer: req.body.issuer,
                signUpType: req.body.signUpType,
                profilePic: {
                  public_id: data.sub,
                  url: data.picture,
                },
              });
              newUser
                .save()
                .then(() => {
                  res.status(201).json({
                    status: true,
                    payload: {
                      message: RESPONSE.CREATED,
                    },
                  });
                })
                .catch(() => {
                  res.status(406).json({
                    status: false,
                    payload: {
                      message: RESPONSE.MISSING,
                    },
                  });
                });
            })
            /* eslint-enable consistent-return */
            .catch(() => {
              res.status(500).json({
                status: false,
                payload: {
                  message: RESPONSE.ERROR,
                },
              });
            });
        })
        .catch(() => {
          res.status(401).json({
            status: false,
            payload: {
              message: RESPONSE.ERRORTOKEN,
            },
          });
        });
    } else if (req.body.issuer === 'facebook') {
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
              status: false,
              payload: {
                message: RESPONSE.CONFLICT,
              },
            });
          }
          const newUser = new User({
            userName: result.user.first_name + result.user.id,
            firstName: result.user.first_name,
            lastName: result.user.last_name,
            email: result.user.email,
            issuer: req.body.issuer,
            signUpType: req.body.signUpType,
            profilePic: {
              url: result.user.picture,
            },
          });
          newUser
            .save()
            .then(() => {
              res.status(201).json({
                status: true,
                payload: {
                  message: RESPONSE.CREATED,
                },
              });
            })
            .catch(() => {
              res.status(406).json({
                status: false,
                payload: {
                  message: RESPONSE.MISSING,
                },
              });
            });
        })
        /* eslint-enable consistent-return */
        .catch(() => {
          res.status(500).json({
            status: false,
            payload: {
              message: RESPONSE.ERROR,
            },
          });
        });
    } else if (req.body.issuer === 'facebook') {
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
            issuer: req.body.issuer,
            signUpType: req.body.signUpType,
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
      res.status(406).json({
        status: false,
        payload: {
          message: RESPONSE.INVALID,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      payload: {
        message: RESPONSE.ERROR,
      },
    });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    if (req.body.issuer === 'google') {
      googleAuth(req.body.access_token)
        .then(async (data) => {
          await User.find({ email: data.email })
            .exec()
            .then((user) => {
              if (user.length >= 1) {
                const [accessToken, refreshToken] = tokenGenerator(user[0]);
                res.cookie('token', refreshToken, { httpOnly: true });
                res.status(200).json({
                  status: true,
                  payload: {
                    message: RESPONSE.LOGIN,
                    accessToken: accessToken,
                  },
                });
              } else {
                res.status(403).json({
                  status: false,
                  payload: {
                    message: RESPONSE.REGISTER,
                  },
                });
              }
            })
            .catch(() => {
              res.status(500).json({
                status: false,
                payload: {
                  message: RESPONSE.ERROR,
                },
              });
            });
        })
        .catch(() => {
          res.status(401).json({
            status: false,
            payload: {
              message: RESPONSE.ERRORTOKEN,
            },
          });
        });
    } else if (req.body.issuer === 'facebook') {
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
          if (user.length === 1) {
            const [accessToken, refreshToken] = tokenGenerator(user[0]);
            res.cookie('token', refreshToken, { httpOnly: true });
            res.status(200).json({
              status: true,
              payload: {
                message: RESPONSE.LOGIN,
                accessToken: accessToken,
              },
            });
          } else {
            res.status(403).json({
              status: false,
              payload: {
                message: RESPONSE.REGISTER,
              },
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            status: false,
            payload: {
              message: RESPONSE.ERROR,
            },
          });
        });
    } else if (req.body.issuer === 'facebook') {
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
            const [accessToken, refreshToken] = tokenGenerator(user[0]);
            res.cookie('token', refreshToken, { httpOnly: true });
            res.status(200).json({
              message: 'Login successful',
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
      res.status(406).json({
        status: false,
        payload: {
          message: RESPONSE.INVALID,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      payload: {
        message: RESPONSE.ERROR,
      },
    });
  }
};

// signout
const logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({
      status: true,
      payload: {
        message: RESPONSE.LOGOUT,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      payload: {
        message: RESPONSE.ERROR,
      },
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
        if (data.n === 1) {
          res.status(200).json({
            status: true,
            payload: {
              message: RESPONSE.DELETED,
            },
          });
        } else {
          res.status(403).json({
            status: false,
            payload: {
              message: RESPONSE.REGISTER,
            },
          });
        }
      })
      .catch(() => {
        res.status(500).json({
          status: false,
          payload: {
            message: RESPONSE.ERROR,
          },
        });
      });
  } catch (err) {
    res.status(500).json({
      status: false,
      payload: {
        message: RESPONSE.ERROR,
      },
    });
  }
};

// getinfo
const getInfo = async (req, res) => {
  await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length === 1) {
        res.status(200).json({
          status: true,
          payload: {
            message: RESPONSE.INFO,
            email: user[0].email,
            userName: user[0].userName,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            picture: user[0].profilePic.url,
          },
        });
      } else {
        res.status(403).json({
          status: false,
          payload: {
            message: RESPONSE.REGISTER,
          },
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        status: false,
        payload: {
          message: RESPONSE.ERROR,
        },
      });
    });
};

module.exports = { signupUser, loginUser, logoutUser, deleteUser, getInfo };
