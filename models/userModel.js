const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please provide your name!"] },
    email: { type: String, required: [true, "Please provide an email!"], unique: [true, "That email address is already in use"], lowercase: true, validate: [validator.isEmail, "Please provide a valid email"] },
    photo: String,
    role:  {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user"
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
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

userSchema.pre("save", function(next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

//we don't users to see unactive property
userSchema.pre(/^find/, function(next) {
    //this points to current query
    this.find({ active: { $ne: false } });
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

//since this token is only valid for 10 minutes, we dont need to hash it with bcrypt
userSchema.methods.createPasswordResetToken = function() {
    //create a new, temporary password for the user using node's crypto module
    //This creates a 72 characters long, cryptographically strong (very random) password using hexadecimal encoding
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")
    console.log({ resetToken }, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;