const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { ErrorHandler } = require('../utils/error');
const { asyncWrapper } = require('../middleware/asyncErrorHander');
const secret = process.env.JWT_SECRET;

const isAuthenticated = asyncWrapper(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) throw new ErrorHandler('Please login to access this resource', 401);

    const decoded = await jwt.verify(token, secret);  //verifying token

    if (!decoded) throw new ErrorHandler('Invalid token', 401);

    req.user = await User.findById(decoded._id) //.lean();  //setting user to req.user

    next();
});

module.exports = { isAuthenticated };