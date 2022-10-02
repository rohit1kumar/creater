const router = require('express').Router();
const { createDonation,
    myDonations,
    findDonations } = require('../controllers/donation');

const { isAuthenticated } = require('../middleware/verifyAuth');

router.route('/').post(isAuthenticated, createDonation); // Create a donation

router.route('/me').get(isAuthenticated, myDonations); // Get all donations made by loggined user

router.route('/:from_creator/:to_creator').get(isAuthenticated, findDonations); // Get all donations from a particular creator A to a particular creator B

module.exports = router;