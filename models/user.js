const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please input Username"],
        unique: true,
        minlength: [8, "Username must be at least 8 characters"]
    },
    email: {
        type: String,
        required: [true, "Please input E-mail"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"]
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema);

module.exports = User;