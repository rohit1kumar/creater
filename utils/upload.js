const multer = require('multer');
const { ErrorHandler } = require('./error');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        let customFileName = crypto.randomBytes(18).toString('hex');
        let fileExtension = file.mimetype.split('/')[1];
        cb(null, customFileName + '.' + fileExtension);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        return cb(new ErrorHandler('Not an image! Please upload an image.', 400), false);
    }
    cb(null, true);
};

let obj = {
    storage,
    limits: {
        fileSize: 0.5 * 1024 * 1024 //500kb
    },
    fileFilter
};

const uploadAvatar = multer(obj).single('avatar');

module.exports = { uploadAvatar };
