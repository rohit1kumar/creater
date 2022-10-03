const router = require('express').Router();
const { signup, login, logout, getAllUsers } = require('../controllers/user');
const { uploadAvatar } = require('../utils/upload');
const { isAuthenticated } = require('../middleware/verifyAuth');

router.route('/').get(isAuthenticated, getAllUsers);

router.route('/signup').post(uploadAvatar, signup);

router.route('/login').post(login);

router.route('/logout').get(logout);

module.exports = router;
