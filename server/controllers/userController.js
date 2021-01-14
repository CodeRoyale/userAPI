const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { googleAuth } = require('../utils/googleAuth');
const RESPONSE = require('../utils/constantResponse');
const nodeMailer = require('../utils/nodeMailer');
const {
  getEmailVerificationToken,
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  getCookieOptions,
  verifyToken,
} = require('../utils/auth');

// secret keys and secret times
/* eslint-disable */
const [FACEBOOK_APP_URL, EMAILVERIFICATION_SECRECT_KEY] = [
  process.env.FACEBOOK_APP_URL || secrets.FACEBOOK_APP_URL,
  process.env.EMAILVERIFICATION_SECRECT_KEY ||
    secrets.EMAILVERIFICATION_SECRECT_KEY,
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
                .catch(() => {
                  // console.log(error);
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
            .catch(() => {
              // console.log(error);
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
    } else if (req.body.issuer === 'self') {
      await User.find({ email: req.body.data.email })
        .exec()
        .then(async (user) => {
          if (user.length >= 1) {
            res.status(409).json({
              status: false,
              payload: {
                message: RESPONSE.CONFLICT,
              },
            });
          }
          let username = req.body.data.email.match(/^([^@]*)@/)[1];
          await User.find({ userName: username })
            .exec()
            .then((usercheck) => {
              if (usercheck.length !== 0) {
                username += usercheck.length;
              }
              req.body.data.userName = username;
            })
            .catch(() => {
              // console.log('error', error);
              res.status(500).json({
                status: false,
                payload: {
                  message: RESPONSE.ERROR,
                },
              });
            });
          if (
            typeof req.body.emailVerified === 'undefined' &&
            typeof req.body.phoneVerified === 'undefined'
          ) {
            bcrypt.hash(req.body.data.password, 10, (err, hash) => {
              if (err) {
                res.status(406).json({
                  success: false,
                  playload: {
                    message: RESPONSE.MISSING,
                  },
                });
              } else {
                const newUser = new User({
                  userName: username,
                  firstName: req.body.data.firstName,
                  lastName: req.body.data.lastName,
                  email: req.body.data.email,
                  issuer: 'self',
                  password: hash,
                  signUpType: req.body.data.signUpType,
                });
                newUser
                  .save()
                  .then(() => {
                    const url = `http://localhost:5000/users/emailVerification?username=${username}&token=${getEmailVerificationToken(
                      req.body.data
                    )}`;
                    nodeMailer(
                      req.body.data.firstName,
                      req.body.data.email,
                      url
                    );
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
              }
            });
          } else {
            // verified was specified in body which is not allowed
            res.status(406).json({
              success: false,
              payload: {
                message: RESPONSE.INVALID,
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
    // console.log('ERR2', error);
    res.status(500).json({
      status: false,
      payload: {
        message: RESPONSE.ERROR,
      },
    });
  }
};

// user verification
const emailVerification = async (req, res) => {
  // till we implement nodemailer or anyother think for security purpose we will use this for dev purpose
  try {
    const payload = verifyToken(
      req.query.token,
      EMAILVERIFICATION_SECRECT_KEY + req.query.username
    );
    if (payload) {
      await User.findOneAndUpdate(
        { email: payload.email },
        { emailVerified: true }
      )
        .exec()
        .then((user) => {
          if (user.length === 0) {
            res.status(401).json({
              success: false,
              payload: {
                message: RESPONSE.REGISTER,
              },
            });
          } else {
            res.status(200).render('confirmedTemplate.ejs', {
              status: 'Successfully Verified',
              url: 'https://www.google.com',
              content: 'CodeRoyale account is verified with your mail',
              page: 'Login Page',
            });
          }
        })
        .catch(() => {
          res.status(500).json({
            success: false,
            payload: {
              message: RESPONSE.ERROR,
            },
          });
        });
    }
  } catch (error) {
    // token was expired or user had made changes in the token
    console.log('ERR', error);
    res.status(400).render('resendLink.ejs', {
      url: 'http://localhost:5000/user/resendLink',
    });
  }
};

// resend mail verification link
const resendLink = async (req, res) => {
  await User.find({ email: req.body.data.email })
    .exec()
    .then((user) => {
      if (user.length === 0) {
        res.status(401).json({
          success: false,
          payload: {
            message: RESPONSE.REGISTER,
          },
        });
      } else {
        bcrypt.compare(
          req.body.data.password,
          user[0].password,
          (err, result) => {
            if (err) {
              res.status(401).json({
                success: false,
                payload: {
                  message: RESPONSE.AUTHERROR,
                },
              });
            }
            // if true create a token
            if (result) {
              const url = `http://localhost:5000/users/emailVerification?username=${
                user[0].userName
              }&token=${getEmailVerificationToken(user[0])}`;
              nodeMailer(user[0].firstName, req.body.data.email, url);
              res.render('verificationSent.ejs');
            }
          }
        );
      }
    })
    .catch(() => {
      res.status(500).json({
        success: false,
        payload: {
          message: RESPONSE.ERROR,
        },
      });
    });
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
    } else if (req.body.issuer === 'self') {
      await User.find({ email: req.body.data.email })
        .exec()
        .then((user) => {
          if (user.length >= 1) {
            bcrypt.compare(
              req.body.data.password,
              user[0].password,
              (err, result) => {
                if (err) {
                  res.status(401).json({
                    success: false,
                    payload: {
                      message: RESPONSE.AUTHERROR,
                    },
                  });
                }
                // if true create a token
                if (result) {
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
                }
              }
            );
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
    .catch(() => {
      // console.log(error);
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
  emailVerification,
  resendLink,
  loginUser,
  logoutUser,
  deleteUser,
  getInfo,
  profileUpdate,
  userNameAvailability,
};
