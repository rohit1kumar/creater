const mongoose = require('mongoose');

const connectDB = (url) => {
    console.log('Connecting to database...');
    return mongoose.connect(url);
};

module.exports = { connectDB };
