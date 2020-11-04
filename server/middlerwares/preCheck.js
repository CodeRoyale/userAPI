const express = require('express');
const RESPONSE = require('../utils/constantResponse');
const User = require('../models/user');
const {
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  verifyToken,
  getCookieOptions,
} = require('../utils/auth');

const router = express.Router();

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_KEY, REFRESH_SECRECT_KEY] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
];
/* eslint-enable */

// generate new access token
router.get('/', async (req, res) => {
  try {
    /* eslint-disable */
    // bearer token
    let token = req.headers.authorization.split(' ')[1];
    // get the cookies
    const refreshToken = req.cookies._coderoyale_rtk;
    let userName = req.cookies._coderoyale_un;
    let payload;
    /* eslint-enable */

    if (!userName) {
      res.status(403).json({
        status: false,
        payload: {
          message: RESPONSE.LOGINREQUIRED,
        },
      });
    }

    // username is stored signed with JWT_KEY
    userName = verifyToken(userName, ACCESS_SECRECT_KEY).userName;

    try {
      // verify accessToken  with server
      payload = verifyToken(token, ACCESS_SECRECT_KEY + userName);
    } catch (err) {
      if (err.message !== 'jwt expired') {
        res.clearCookie('_coderoyale_rtk');
        res.clearCookie('_coderoyale_un');
        res.status(401).json({
          status: false,
          payload: {
            message: RESPONSE.AUTHERROR,
          },
        });
      }
    }

    // if accessToken verify failed
    if (!payload) {
      const user = await User.findOne({ userName: userName });

      // check for the refreshtoken
      payload = verifyToken(
        refreshToken,
        process.env.REFRESH_SECRECT_KEY + user.password
      );

      // the access and refresh token failed
      if (!payload) {
        throw new Error('Auth Failed');
      }

      // if the refreshJwtToken worked so set new tokens
      token = getAccessToken(user);
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
    }

    res.status(200).json({
      status: true,
      payload: {
        message: RESPONSE.TOKEN,
        accessToken: token,
      },
    });
  } catch (error) {
    // token was expired or user had made changes in the token
    res.clearCookie('_coderoyale_rtk');
    res.clearCookie('_coderoyale_un');
    res.status(401).json({
      status: false,
      payload: {
        message: RESPONSE.AUTHERROR,
      },
    });
  }
});

module.exports = router;
