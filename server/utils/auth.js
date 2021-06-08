const jwt = require('jsonwebtoken');

// secret keys and secret times
/* eslint-disable */
const [
  ACCESS_SECRET_KEY,
  ACCESS_SECRET_TIME,
  REFRESH_SECRET_KEY,
  REFRESH_SECRET_TIME,
  EMAILVERIFICATION_SECRET_KEY,
  EMAILVERIFICATION_SECRET_TIME,
] = [
  process.env.ACCESS_SECRET_KEY,
  process.env.ACCESS_SECRET_TIME,
  process.env.REFRESH_SECRET_KEY,
  process.env.REFRESH_SECRET_TIME,
  process.env.EMAILVERIFICATION_SECRET_KEY,
  process.env.EMAILVERIFICATION_SECRET_TIME,
];
/* eslint-enable */

const getEmailVerificationToken = (user) => {
  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
      userName: user.userName,
      firstName: user.firstName,
    },
    EMAILVERIFICATION_SECRET_KEY + user.userName,
    {
      expiresIn: EMAILVERIFICATION_SECRET_TIME,
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
    ACCESS_SECRET_KEY + user.userName,
    {
      expiresIn: ACCESS_SECRET_TIME,
    }
  );
  return accessToken;
};

const getUserNameToken = (user) => {
  const accessToken = jwt.sign(
    {
      userName: user.userName,
    },
    ACCESS_SECRET_KEY,
    {
      expiresIn: REFRESH_SECRET_TIME,
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
    REFRESH_SECRET_KEY + user.password,
    {
      expiresIn: REFRESH_SECRET_TIME,
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
