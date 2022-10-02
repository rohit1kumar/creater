const { Donation } = require('../models/donation');
const { User } = require('../models/user');
const { asyncWrapper } = require('../middleware/asyncErrorHander');
const { ErrorHandler } = require('../utils/error');

// @desc    Create a donation
// @route   POST /api/v1/donation
// @access  Private
const createDonation = asyncWrapper(async (req, res) => {
    let { currency, amount, name, message, to_creator } = req.body;
    const from_creator = req.user._id;

    if (currency) currency = currency.trim();
    if (amount) amount = amount.trim();
    if (name) name = name.trim();
    if (message) message = message.trim();
    if (to_creator) to_creator = to_creator.trim();

    const user = await User.findById(to_creator);
    if (!user) throw new ErrorHandler('User not found', 404);

    const donation = await Donation.create({
        currency,
        amount,
        name,
        message,
        to_creator,
        from_creator
    });
    res.status(201).json({
        message: "Donation created",
        data: {
            _id: donation._id,
            currency: donation.currency,
            amount: donation.amount,
            name: donation.name,
            message: donation.message,
            to_creator: donation.to_creator,
            from_creator: donation.from_creator
        }
    });
});

// @desc    Get all donations made by loggined user
// @route   GET /api/v1/donation/me
// @access  Private
const myDonations = asyncWrapper(async (req, res) => {
    const donations = await Donation.aggregate([
        {
            $match: {
                from_creator: req.user._id
            }
        },
        {
            $group: {
                _id: '$to_creator',
                totalAmount: { $sum: '$amount' },
                donations: {
                    $push: {
                        _id: '$_id',
                        amount: '$amount',
                        date: '$createdAt'
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'to_creator'
            }
        },
        {
            $project: {
                _id: 0,
                to_creator: {
                    _id: 1,
                    username: 1
                },
                totalAmount: 1,
                donations: 1,
            }
        }
    ]);

    if (donations.length === 0) throw new ErrorHandler('No donations found', 404);

    res.status(200).json({
        message: "Donations found",
        data: donations
    });
});

// @desc    Get all donations from a particular creator A to a particular creator B
// @route   GET /api/v1/donation/:from_creator/:to_creator
// @access  Private
const findDonations = asyncWrapper(async (req, res) => {
    let { from_creator, to_creator } = req.params;

    if (from_creator) from_creator = from_creator.trim();
    if (to_creator) to_creator = to_creator.trim();

    if (!from_creator || !to_creator) throw new ErrorHandler('Both from_creator and to_creator must be provided', 400);


    const donations = await Donation.find({ from_creator, to_creator })
        .populate('from_creator', 'username')
        .populate('to_creator', 'username')
        .select('-__v -name -message -updatedAt');

    const totalAmount = donations.reduce((acc, donation) => acc + donation.amount, 0);

    if (donations.length === 0) throw new ErrorHandler('No donations found', 404);

    res.status(200).json({
        message: "Donations found",
        data: { totalAmount, donations }
    });
});

module.exports = { createDonation, myDonations, findDonations };
