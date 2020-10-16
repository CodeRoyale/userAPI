const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { googleAuth } = require('../utils/googleAuth');
const RESPONSE = require('../utils/constantResponse');
const {
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  getCookieOptions,
} = require('../utils/auth');

// secret keys and secret times
/* eslint-disable */
const [FACEBOOK_APP_URL] = [
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
            .then(async (user) => {
              if (user.length === 1) {
                return res.status(409).json({
                  status: true,
                  payload: {
                    message: RESPONSE.CONFLICT,
                  },
                });
              }
              let username = data.email.match(/^([^@]*)@/)[1];
              await User.find({ userName: username })
                .exec()
                .then((usercheck) => {
                  if (usercheck.length !== 0) {
                    username += usercheck.length;
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({
                    status: false,
                    payload: {
                      message: RESPONSE.ERROR,
                    },
                  });
                });
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                  throw new Error('Password Encrption Failed');
                }
                const newUser = new User({
                  userName: username,
                  firstName: data.given_name,
                  lastName: data.family_name,
                  email: data.email,
                  issuer: req.body.issuer,
                  password: hash,
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
        .then(async (user) => {
          if (user.length >= 1) {
            return res.status(409).json({
              status: false,
              payload: {
                message: RESPONSE.CONFLICT,
              },
            });
          }
          let username = result.user.email.match(/^([^@]*)@/)[1];
          await User.find({ userName: username })
            .exec()
            .then((usercheck) => {
              if (usercheck.length !== 0) {
                username += usercheck.length;
              }
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                status: false,
                payload: {
                  message: RESPONSE.ERROR,
                },
              });
            });
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              throw new Error('Password Encrption Failed');
            }
            const newUser = new User({
              userName: username,
              firstName: result.user.first_name,
              lastName: result.user.last_name,
              email: result.user.email,
              issuer: req.body.issuer,
              password: hash,
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
                  getUserNameToken(user[0]),
                  getCookieOptions(604800000)
                );
                res.status(200).json({
                  status: true,
                  payload: {
                    message: RESPONSE.LOGIN,
                    accessToken: getAccessToken(user[0]),
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
              getUserNameToken(user[0]),
              getCookieOptions(604800000)
            );
            res.status(200).json({
              status: true,
              payload: {
                message: RESPONSE.LOGIN,
                accessToken: getAccessToken(user[0]),
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
    .then((user) => {
      res.cookie(
        '_coderoyale_rtk',
        getRefreshToken(user),
        getCookieOptions(604800000)
      );
      res.cookie(
        '_coderoyale_un',
        getUserNameToken(user),
        getCookieOptions(604800000)
      );
      res.status(200).json({
        status: true,
        payload: {
          message: RESPONSE.UPDATE,
          accessToken: getAccessToken(user),
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
  await User.find({ userName: req.query.userName })
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
    .catch((error) => {
      console.log(error);
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
