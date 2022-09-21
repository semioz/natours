const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");
const sendEmail = require("./../utils/email.js");

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });

    const token = signToken(newUser._id)

    res.status(201).json({
        status: "success",
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async(req, res, next) => {
    const { email, password } = req.body;

    //check if email and password exist
    if (!email || !password) {
        return next(new AppError("Please provide an email and a password", 400))
    }
    //check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Incorrect email or password", 401))
    }
    //if everything is OK, send the token to the client
    const token = signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
});

//created this middleware to see if user is authenticated or not.
exports.protect = catchAsync(async(req, res, next) => {
    let token;
    //get the token and check if its exists
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }
    console.log(token)

    if (!token) {
        return next(new AppError("You're not logged in! Please log in to get access!", 401))
    }

    //verify the jwt
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //check if the user of this token, still exists
    const freshUser = await User.findById(decoded.id)
    if (!freshUser) {
        return next(new AppError("The user belonging to this token does not exists!"))
    }
    //check if the user has changed his/her password after token was issued(iat = issued at)
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError("User recently changed the password! Please log in!", 401))
    }

    req.user = freshUser;
    next();
});

exports.restricTo = (...roles) => {
    return (req, res, next) => {
        //roles -> ["admin","guide", etc.]
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You do not have permission to perform this action"), 403)
        }
    }
};

exports.forgotPassword = catchAsync(async(req, res, next) => {
    //get user based on posted email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("There is no user with that email address!", 404))

    }
    //generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //send it to user's email
    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${resetToken}`

    const message = `Forgot your password? Submit a patch request with your new password and passwordConfirm to ${resetURL}.\nIf not, please do ignore this email!`

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset token (valid for only 10 minutes!)",
            message
        });
        res.status(200).json({
            status: "success",
            message: "Token sent to email!"
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new AppError("There was an error sending the email. Try again later!"), 500)
    }
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    //get user based on the token
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })
        //if token hasn't expired, and there is user, set the new password
    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
        //update "changedPasswordAt" property for the user.
        //log the user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token
    })
});