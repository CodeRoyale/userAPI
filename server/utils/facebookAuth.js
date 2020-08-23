const express = require('express');
const passport = require('passport');

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
      message: 'Not authenticated',
    });
  }
});

module.exports = router;
