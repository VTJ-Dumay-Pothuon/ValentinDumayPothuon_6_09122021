const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const emailCtrl = require('../middleware/checkEmail');

router.post('/signup',emailCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;