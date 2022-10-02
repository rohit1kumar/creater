const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: [true, 'Username already exists'],
        trim: true,
        lowercase: true,
        minlength: [2, 'Username must be at least 2 characters long'],
    },

    password: {
        type: String,
        required: [true, 'Please enter a password'],
        select: false
    },
    avatar: {
        key: String,
        location: String
    },
    profession: {
        type: String,
        required: [true, 'Please enter your profession'],
        lowercase: true,
        trim: true
    }
});

//  hash the password before saving
userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10); //10 is the number of rounds of hashing algorithm or salt
    next();
});

// comparing password with hashed password in database
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generating token for user
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, jwt_secret);
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
