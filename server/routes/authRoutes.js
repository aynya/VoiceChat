const express = require('express');
const router = express.Router();
const { register, login, refreshToken } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

module.exports = router;