const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please provide your name!"] },
    email: { type: String, required: [true, "Please provide an email!"], unique: [true, "That email address is already in use"], lowercase: true, validate: [validator.isEmail, "Please provide a valid email"] },
    photo: String,
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            //this only works on CREATE and SAVE
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same!"
        }
    },
    passwordChangedAt: Date
});
//password hashing
userSchema.pre("save", async function(next)  {
    //only run this function if password was actually modified
    if (!this.isModified("password")) return next();

    //do not save the "password confirm" to database.
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimeStamp
    }
    //false means "not changed"
    return false;
}

const User = mongoose.model("User", userSchema);

module.exports = User;