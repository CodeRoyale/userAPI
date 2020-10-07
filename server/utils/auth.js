const jwt = require('jsonwebtoken');

// secret keys and secret times
/* eslint-disable */
const [ACCESS_SECRECT_TIME, REFRESH_SECRECT_KEY, REFRESH_SECRECT_TIME] = [
  process.env.ACCESS_SECRECT_TIME || secrets.ACCESS_SECRECT_TIME,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
  process.env.REFRESH_SECRECT_TIME || secrets.REFRESH_SECRECT_TIME,
];
/* eslint-enable */

const getAccessToken = (user, secret, long) => {
  const accessToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.profilePic.url,
    },
    secret,
    {
      expiresIn: long ? REFRESH_SECRECT_TIME : ACCESS_SECRECT_TIME,
    }
  );
  return accessToken;
};

const getRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
    },
    REFRESH_SECRECT_KEY + user.password,
    {
      expiresIn: REFRESH_SECRECT_TIME,
    }
  );
  return refreshToken;
};

const verifyToken = (token, key) => {
  try {
    const payload = jwt.verify(token, key);
    return payload;
  } catch (err) {
    return false;
  }
};

const getCookieOptions = (TTL) => ({
  maxAge: TTL,
  httpOnly: true,
  secure: process.env.NODE_ENV !== "test",
  sameSite: "None",
});

module.exports = {
  getAccessToken,
  getRefreshToken,
  verifyToken,
  getCookieOptions,
};
