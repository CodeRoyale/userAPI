const Router = require('express');

const router = Router();
const checkAuth = require('../middlerwares/checkAuth');

const {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
  getInfo,
} = require('../controllers/userController');

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/logout', checkAuth, logoutUser);
router.delete('/delete', checkAuth, deleteUser);
router.get('/info', checkAuth, getInfo);

module.exports = router;
