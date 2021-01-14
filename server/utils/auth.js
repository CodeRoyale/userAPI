const jwt = require('jsonwebtoken');

// secret keys and secret times
/* eslint-disable */
const [
  ACCESS_SECRECT_KEY,
  ACCESS_SECRECT_TIME,
  REFRESH_SECRECT_KEY,
  REFRESH_SECRECT_TIME,
  EMAILVERIFICATION_SECRECT_KEY,
  EMAILVERIFICATION_SECRECT_TIME,
] = [
  process.env.ACCESS_SECRECT_KEY || secrets.ACCESS_SECRECT_KEY,
  process.env.ACCESS_SECRECT_TIME || secrets.ACCESS_SECRECT_TIME,
  process.env.REFRESH_SECRECT_KEY || secrets.REFRESH_SECRECT_KEY,
  process.env.REFRESH_SECRECT_TIME || secrets.REFRESH_SECRECT_TIME,
  process.env.EMAILVERIFICATION_SECRECT_KEY ||
    secrets.EMAILVERIFICATION_SECRECT_KEY,
  process.env.EMAILVERIFICATION_SECRECT_TIME ||
    secrets.EMAILVERIFICATION_SECRECT_TIME,
];
/* eslint-enable */

const getEmailVerificationToken = (user) => {
  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
    },
    EMAILVERIFICATION_SECRECT_KEY + user.userName,
    {
      expiresIn: EMAILVERIFICATION_SECRECT_TIME,
    }
  );
  return emailVerificationToken;
};

const getAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.profilePic.url,
    },
    ACCESS_SECRECT_KEY + user.userName,
    {
      expiresIn: ACCESS_SECRECT_TIME,
    }
  );
  return accessToken;
};

const getUserNameToken = (user) => {
  const accessToken = jwt.sign(
    {
      userName: user.userName,
    },
    ACCESS_SECRECT_KEY,
    {
      expiresIn: REFRESH_SECRECT_TIME,
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
    if (err.message !== 'jwt expired') {
      // console.log("utils-err", err.message);
      // return err;
      throw new Error(err.message);
    }
    return false;
  }
};

const getCookieOptions = (TTL) => ({
  maxAge: TTL,
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'test',
  sameSite: 'None',
});

module.exports = {
  getEmailVerificationToken,
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  verifyToken,
  getCookieOptions,
};
