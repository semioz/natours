const AppError = require("../utils/appError")

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.keyValue.name;
    console.log(value)
    const message = `Duplicate field value: x. Please use another value'!`
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
};

const sendErrorProd = (err, res) => {
    //operational, trusted error: send message to the client
    if (err.isOperational) {
        res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
            //programming or other unknown error: don't leak error details!
    } else {
        //log the error
        console.log("ERROR", err)

        //send generic message
        res.status(500).json({
            status: "error",
            message: "Something went wrong!"
        })
    }
};


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign(err);
        if (error.name === "CastError") error = handleCastErrorDB(error)
        if (error.code === 1100) error = handleDuplicateFieldsDB(error)

        sendErrorProd(error, res)
    }
};