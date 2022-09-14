const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync.js");

exports.signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            user: newUser
        }
    })
});