const { User } = require("../models/user");
const { ErrorHandler } = require('../utils/error');
const { asyncWrapper } = require('../middleware/asyncErrorHander');
const { uploadToS3 } = require('../utils/s3');
const { unlink } = require('fs/promises');

// @desc    Register a user
// @route   POST /api/v1/user/register
// @access  Public
const signup = asyncWrapper(async (req, res) => {

    let { username, password, profession } = req.body;

    if (username) username = username.trim();
    if (password) password = password.trim();
    if (profession) profession = profession.trim();

    if (!username || !password || !profession || !req.file) throw new ErrorHandler('All the fields are required, including avatar', 400);
    // check if user already exists
    const userFound = await User.findOne({ username });

    if (userFound) throw new ErrorHandler('Username is already taken', 400);

    const s3 = await uploadToS3(req.file);

    const user = await User.create({
        username,
        password,
        profession,
        avatar: {
            key: s3.Key,
            location: s3.Location
        }
    });

    const token = await user.generateToken(); //generate a token for the user

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({  //send the cookie and the user data
        message: "User created",
        data: {
            _id: user._id,
            username: user.username,
            profession: user.profession,
            avatar: user.avatar.location
        },
        token
    });

    if (req.file) await unlink(req.file.path); //delete the file from server after uploading to s3
});

// @desc    Login a user
// @route   POST /api/v1/user/login
// @access  Public
const login = asyncWrapper(async (req, res) => { //login a user

    let { username, password } = req.body;
    if (username) username = username.trim();
    if (password) password = password.trim();

    if (!username || !password) throw new ErrorHandler('All the fields are required', 400);

    const user = await User.findOne({ username }).select("+password");

    if (!user) throw new ErrorHandler('Invalid username', 401);

    const isMatch = await user.matchPassword(password);

    if (!isMatch) throw new ErrorHandler('Invalid password', 401);

    const token = await user.generateToken();

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
        message: "Logged in",
        data: {
            _id: user._id,
            username: user.username
        },
        token
    });
});

// @desc    Logout a user
// @route   GET /api/v1/user/logout
// @access  Private
const logout = asyncWrapper(async (req, res) => {  //logout a user
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    };
    res.status(200).cookie("token", null, options).json({
        message: "Logged out",
    });
});


const getAllUsers = asyncWrapper(async (req, res) => { //get all users
    let { page, limit } = req.query;

    /*PAGINATION*/
    limit = parseInt(limit);
    page = parseInt(page);

    if (!limit || limit < 1) limit = 10; // default limit
    if (!page || page < 1) page = 1;

    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit).select('-__v');

    if (users.length === 0) throw new ErrorHandler('No users found', 404);

    res.status(200).json({
        count: users.length,
        data: users
    });
});

module.exports = { signup, login, logout, getAllUsers };
