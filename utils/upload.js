const multer = require('multer');
const { ErrorHandler } = require('./error');

const uploadFileToServer = multer({
    dest: './uploads',
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.match('image')) {
            return cb(new ErrorHandler('Only .png, .jpg and .jpeg format allowed!', 400), false);
        }
        return cb(null, true);
    }

}).single('avatar');

module.exports = { uploadFileToServer };