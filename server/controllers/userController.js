const fetch = require('node-fetch');
const User = require('../models/user');
const { googleAuth } = require('../utils/googleAuth');
const RESPONSE = require('../utils/constantResponse');
const {
  getAccessToken,
  getRefreshToken,
  getCookieOptions,
} = require('../utils/auth');

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_KEY, REFRESH_SECRECT_KEY, FACEBOOK_APP_URL] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
  process.env.FACEBOOK_APP_URL || secrets.FACEBOOK_APP_URL,
];
/* eslint-enable */

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
                res.cookie(
                  '_coderoyale_rtk',
                  getRefreshToken(user[0]),
                  getCookieOptions(604800000)
                );
                res.cookie(
                  '_coderoyale_un',
                  getAccessToken(user[0], ACCESS_SECRECT_KEY, true),
                  getCookieOptions(604800000)
                );
                res.status(200).json({
                  status: true,
                  payload: {
                    message: RESPONSE.LOGIN,
                    accessToken: getAccessToken(
                      user[0],
                      ACCESS_SECRECT_KEY + user[0].userName,
                      false
                    ),
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
            res.cookie(
              '_coderoyale_rtk',
              getRefreshToken(user[0]),
              getCookieOptions(604800000)
            );
            res.cookie(
              '_coderoyale_un',
              getAccessToken(user[0], ACCESS_SECRECT_KEY, true),
              getCookieOptions(604800000)
            );
            res.status(200).json({
              status: true,
              payload: {
                message: RESPONSE.LOGIN,
                accessToken: getAccessToken(
                  user[0],
                  ACCESS_SECRECT_KEY + user[0].userName,
                  false
                ),
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
    res.clearCookie('_coderoyale_rtk');
    res.clearCookie('_coderoyale_un');
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
    // get data in playload from middleware
    const payloadData = req.payload;
    User.deleteOne({ userName: payloadData.userName })
      .exec()
      .then((data) => {
        if (data.n === 1) {
          res.clearCookie('_coderoyale_rtk');
          res.clearCookie('_coderoyale_un');
          res.status(200).json({
            status: true,
            payload: {
              message: RESPONSE.DELETED,
            },
          });
        } else {
          res.status(404).json({
            status: false,
            payload: {
              message: RESPONSE.NOUSER,
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
  await User.find({ email: req.query.email })
    .exec()
    .then((user) => {
      if (user.length === 1) {
        res.status(200).json({
          status: true,
          payload: {
            message: RESPONSE.INFO,
            accessToken: req.accessToken,
            email: user[0].email,
            userName: user[0].userName,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            picture: user[0].profilePic.url,
          },
        });
      } else {
        res.status(404).json({
          status: false,
          payload: {
            message: RESPONSE.NOUSER,
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

const profileUpdate = async (req, res) => {
  const updateData = {};
  if (req.body.firstName) updateData.firstName = req.body.firstName;
  if (req.body.lastName) updateData.lastName = req.body.lastName;
  if (req.body.userName) updateData.userName = req.body.userName;
  if (req.body.profilePic) updateData.profilePic.url = req.body.profilePic;

  await User.findOneAndUpdate(
    { email: req.payload.email },
    { $set: updateData },
    { new: true }
  )
    .exec()
    .then((updatedData) => {
      res.status(200).json({
        status: true,
        payload: {
          message: RESPONSE.UPDATE,
          accessToken: req.accessToken,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          userName: updatedData.userName,
          profilePic: updatedData.profilePic.url,
          email: updatedData.email,
        },
      });
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

const userNameAvailability = async (req, res) => {
  await User.find(req.query.userName)
    .exec()
    .then((user) => {
      if (user.length === 0) {
        res.status(200).json({
          status: true,
          payload: {
            message: RESPONSE.AVAILABLE,
            accessToken: req.accessToken,
          },
        });
      } else {
        res.status(409).json({
          status: false,
          payload: {
            message: RESPONSE.CONFLICT,
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

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
  getInfo,
  profileUpdate,
  userNameAvailability,
};
