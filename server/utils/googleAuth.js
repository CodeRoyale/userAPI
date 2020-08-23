const googleAuthLibrary = require('google-auth-library');

const { OAuth2Client } = googleAuthLibrary;

// secret keys and secret times
/* eslint-disable */
const [CLIENT_ID] = [process.env.CLIENT_ID || secrets.CLIENT_ID];
/* eslint-enable */

const client = new OAuth2Client(CLIENT_ID);

// Using a Google API Client Library for verify idToken send by frontend
async function googleAuth(accessToken) {
  const ticket = await client.verifyIdToken({
    idToken: accessToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (payload.aud !== CLIENT_ID) {
    throw new Error('Invalid token signature');
  } else {
    return payload;
  }
}

module.exports = { googleAuth };
