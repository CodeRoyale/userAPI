const User = require('../models/user');

// signup
const signupUser = async (req, res) => {};

// login
const loginUser = async (req, res) => {
  try {
    const { thirdPartyData } = req.body;

    if (thirdPartyData.issuer === 'google') {
      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client(process.env.CLIENT_ID);
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: thirdPartyData.idToken,
          audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
          // Or, if multiple clients access the backend:
          //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // TO LOG THE ERROR
        //   verify().catch(console.error);
        console.log(payload);
        if (payload.aud !== process.env.CLIENT_ID) {
          throw new Error('Invalid token signature');
        }
      }
      verify().catch(console.error);
    } else {
      throw new Error('Unrecognized data !');
    }

    res.status(200).json({
      message: `Login sucessfull!`,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: err.message,
    });
  }
};

// signout
const logoutUser = async (req, res) => {};

// deleteUser
const deleteUser = async (req, res) => {};

module.exports = { signupUser, loginUser, logoutUser, deleteUser };
