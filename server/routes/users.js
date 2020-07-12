const Router = require('express');
const router = Router();

const {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/signup', signupUser);

module.exports = router;
