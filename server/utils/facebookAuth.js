const express = require('express');
const passport = require('passport');
const RESPONSE = require('./constantResponse');

const router = express.Router();

router.post('/', passport.authenticate('facebook-token'), (req, res) => {
  // console.log(req);
  if (req.user) {
    // you're authenticated! return sensitive secret information here.
    res.status(200).json({
      user: req.user,
    });
  } else {
    // not authenticated. go away.
    res.status(401).json({
      status: false,
      payload: {
        message: RESPONSE.AUTHERROR,
      },
    });
  }
});

module.exports = router;
