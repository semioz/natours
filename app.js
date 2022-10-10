const express = require("express");
const app = express();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controllers/errorController.js");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");
const reviewRouter = require("./routes/reviewRoute");

//Global Middlewares
//Set security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
};

//limit requests from same API
const limiter = rateLimit({
    //this will allow 100 request from same api in one hour
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again later!"
});

app.use("/api", limiter);

//body parser
app.use(express.json({
    limit: "10kb"
}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS attacks
app.use(xss());

//prevent parameter pollution
app.use(hpp({
    whitelist: [
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "difficulty",
        "maxGroupSize",
        "price"
    ]
}));

//serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//--Routes--
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;