const Router = require('express');

const router = Router();
const checkAuth = require('../middlerwares/checkAuth');

const {
  signupUser,
  emailVerification,
  resendLink,
  loginUser,
  logoutUser,
  deleteUser,
  getInfo,
  profileUpdate,
  userNameAvailability,
} = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/emailverification', emailVerification);
router.post('/resendlink', resendLink);
router.post('/signup', signupUser);
router.get('/logout', checkAuth, logoutUser);
router.delete('/delete', checkAuth, deleteUser);
router.get('/info', checkAuth, getInfo);
router.patch('/update', checkAuth, profileUpdate);
router.get('/username', checkAuth, userNameAvailability);

module.exports = router;
