const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please provide your name!"] },
    email: { type: String, required: [true, "Please provide an email!"], unique: [true, "That email address is already in use"], lowercase: true, validate: [validator.isEmail, "Please provide a valid email"] },
    photo: String,
    password: { type: String, required: [true, "Please provide a password!"], minLength: 8 },
    passwordConfirm: { type: String, required: [true, "Please confirm your password"] }
});

const User = mongoose.model("User", userSchema);

module.exports = User;