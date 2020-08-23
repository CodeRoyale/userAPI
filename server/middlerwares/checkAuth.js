const jwt = require('jsonwebtoken');

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_KEY] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
];
/* eslint-enable */

// check if the user has logged in before using the services
module.exports = (req, res, next) => {
  try {
    // bearer token
    const token = req.headers.authorization.split(' ')[1];
    // verify it with server
    const decode = jwt.verify(token, ACCESS_SECRECT_KEY);
    req.data = decode;
    // continue the control-flow of the code
    next();
    return;
  } catch (error) {
    // token was expired or user had made changes in the token
    res.status(401).json({
      message: 'Token Expired',
    });
  }
};
