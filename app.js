const express = require("express");
const app = express();
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoute");
const userRouter = require("./routes/userRoute");

//Middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});


app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//Server
const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}...`);
})