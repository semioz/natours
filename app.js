const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

//Global Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
};

const limiter = rateLimit({
    //this will allow 100 request from same api in one hour
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again later!"
});

app.use("/api", limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;