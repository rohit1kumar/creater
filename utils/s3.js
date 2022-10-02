const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
require('dotenv').config();

const bucketName = process.env.AWS_BACKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_ACCESS_SECRET_KEY;
const region = process.env.AWS_REGION;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

const uploadToS3 = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    };

    return s3.upload(uploadParams).promise();
};


module.exports = { uploadToS3 };
