const bcrypt = require('bcrypt');
const express = require('express');

const router = express.Router();
const User = require('../models/user');
const RESPONSE = require('../utils/constantResponse');
const {
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  getCookieOptions,
} = require('../utils/auth');

router.post('/', async (req, res) => {
  await User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
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
});

module.exports = router;
