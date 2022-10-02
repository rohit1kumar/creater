const router = require('express').Router();
const { signup, login, logout, getAllUsers } = require('../controllers/user');
const { uploadFileToServer, deleteFileFromServer, uploadToCloud } = require('../utils/upload');
const { isAuthenticated } = require('../middleware/verifyAuth');

router.route('/').get(isAuthenticated, getAllUsers);

router.route('/signup').post(uploadFileToServer, signup);

router.route('/login').post(login);

router.route('/logout').get(logout);

module.exports = router;
