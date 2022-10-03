const fs = require('fs/promises');

const errorMiddleware = async (err, req, res, next) => {
    err.message = err.message || 'Something went wrong, try again later';
    err.statusCode = err.statusCode || 500;

    /* MONGODB DUPLICATE ERROR */
    if (err.code === 11000) {
        const key = Object.keys(err.keyValue);
        const value = Object.values(err.keyValue);
        err.message = `${key} '${value}' already exists`;
        err.statusCode = 400;
    };

    /* MONGODB VALIDATION ERROR */
    if (err.name === 'ValidationError') {
        err.message = Object.values(err.errors).map((val) => val.message).join(', ');
        err.statusCode = 400;
    }

    if (err.name === 'CastError') {
        err.message = `No data found with petId ${err.value}`;
        err.statusCode = 404;
    }

    if (req.file) await fs.unlink(req.file.path); //delete the file from server if there is an error

    // if in the dev mode send the error message and stack trace
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            message: err.message,
            stack: err.stack,
        });
    }

    res.status(err.statusCode).json({
        message: err.message
    });
};

const notFound = (req, res,) => res.status(404).json({ success: false, message: 'Route not found' });

module.exports = { errorMiddleware, notFound };
