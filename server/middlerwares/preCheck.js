const express = require('express');
const jwt = require('jsonwebtoken');
const RESPONSE = require('../utils/constantResponse');

const router = express.Router();

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_KEY] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
];
/* eslint-enable */

// generate new access token
router.get('/', (req, res) => {
  try {
    // get the cookies
    /* eslint-disable */
    let userName = req.cookies._coderoyale_un;
    /* eslint-enable */
    if (!userName) {
      res.status(403).json({
        status: false,
        payload: {
          message: RESPONSE.LOGINREQUIRED,
        },
      });
    }

    const token = req.headers.authorization.split(' ')[1];
    // username is stored signed with JWT_KEY
    userName = jwt.verify(userName, ACCESS_SECRECT_KEY).userName;

    try {
      // verify accessToken  with server
      jwt.verify(token, ACCESS_SECRECT_KEY + userName);
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
