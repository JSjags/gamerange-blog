const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//bcrypt
const bcrypt = require('bcrypt');

// validator
const { isEmail } = require('validator');

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please Input Username"],
        unique: true,
        minlength: [6, "Username must be at least 6 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Input E-mail"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid E-mail"]
    },
    password: {
        type: String,
        required: [true, "Please Input Password"],
        minlength: [6, "Password must be at least 6 characters"]
    },
    profile_pic: {
        type: String,
    }
}, {timestamps: true})

// hashing user passwords with bcrypt before creating user
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// hashing user passwords with bcrypt before updating
userSchema.pre('findOneAndUpdate', async function (next) {
    if(this._update.password) {
        const salt = await bcrypt.genSalt();
        this._update.password = await bcrypt.hash(this._update.password, salt)
    }
    next();
});

// creating static function to log in user
userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username })
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Password is incorrect");
    }
    throw Error("Username not registered");
}

const User = mongoose.model('User', userSchema);

module.exports = User;