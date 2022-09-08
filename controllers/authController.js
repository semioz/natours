const User = require("./../models/userModel");

exports.signUp = async(req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        statu: "success",
        data: {
            user: newUser
        }
    })
};