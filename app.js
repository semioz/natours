const express = require("express");
const app = express();
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

//Middlewares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
};
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;