const express = require('express');
const jwt = require('jsonwebtoken');
const RESPONSE = require('../utils/constantResponse');

const router = express.Router();

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_KEY, ACCESS_SECRECT_TIME, REFRESH_SECRECT_KEY] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.ACCESS_SECRECT_TIME || secrets.ACCESS_SECRECT_TIME,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
];
/* eslint-enable */

// generate new access token
router.post('/', (req, res) => {
  try {
    if (!req.cookies.token) {
      return res.status(403).json({
        status: false,
        payload: {
          message: RESPONSE.LOGINREQUIRED,
        },
      });
    }
    // console.log(req.cookies.token);
    const { token } = req.cookies;
    jwt.verify(token, REFRESH_SECRECT_KEY);
    // decode the token to get the data
    const decoded = jwt.decode(token, { complete: true });
    // data is stored is in playload
    const payLoadData = decoded.payload;
    // console.log(payLoadData);
    const accessToken = jwt.sign(
      {
        email: payLoadData.email,
        userName: payLoadData.userName,
        firstName: payLoadData.firstName,
        lastName: payLoadData.lastName,
        picture: payLoadData.picture,
      },
      ACCESS_SECRECT_KEY,
      {
        expiresIn: ACCESS_SECRECT_TIME,
      }
    );
    return res.status(200).json({
      status: true,
      payload: {
        message: RESPONSE.TOKEN,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    // token was expired or user had made changes in the token
    return res.status(401).json({
      status: false,
      payload: {
        message: RESPONSE.AUTHERROR,
      },
    });
  }
});

module.exports = router;
