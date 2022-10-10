const fs = require("fs");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel.js");

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

//IMPORT DATA INTO DB
const importData = async() => {
    try {
        await Tour.create(tours)
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