const mongoose = require("mongoose");
const dotenv = require('dotenv');

//catch uncaught exception
process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION: Shutting down!")
    console.log(err.name, err.message)
    process.exit(1)
});

dotenv.config({ path: './config.env' });
const app = require("./app");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connection Is Successful");
}).catch(err => {
    console.log("Can't establish connection to MongoDB")
    console.log(err)
})

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

//this is not working properly. 122
process.on("unhandledRejection", err => {
    console.log("UNHANDLED REJECTION: Shutting down...")
    console.log(err.name, err.message)
    server.close(() =>  {
        process.exit(1);
    })
});