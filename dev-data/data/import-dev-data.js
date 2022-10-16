const fs = require("fs");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel.js");
const User = require("./../../models/userModel.js");
const Review = require("./../../models/reviewModel.js");


dotenv.config({ path: './config.env' });

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB Connection Is Successful");
    }).catch(err => {
        console.log("Can't establish connection to MongoDB")
        console.log(err)
    })
    //READ THE JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));

//IMPORT DATA INTO DB
const importData = async() => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data loaded successfully");
        process.exit();
    } catch (err) {
        console.log(err)
    }
};

//DELETE ALL DATA IN DB
const deleteData = async() => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
        console.log("Data deleted successfully");
        process.exit();
    } catch (err) {
        console.log(err)
    }
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
};