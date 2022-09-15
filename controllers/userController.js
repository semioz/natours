const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync.js");

exports.getAllUsers = async(req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users
        }
    })
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
exports.createUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "Route is not defined yet"
    })
};