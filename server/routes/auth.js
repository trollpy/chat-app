const express = require('express');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validation');

const router = express.Router();

router.post('/register', registerRules(), register);
router.post('/login', loginRules(), login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;