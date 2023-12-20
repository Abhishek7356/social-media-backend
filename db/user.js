
const mongoose = require('mongoose');
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        max: 6,
    },
    profile_picture: {
        type: String,
        default: ""
    },
    cover_picture: {
        type: String,
        default: ""
    },
    followings: {
        type: Array,
        default: []
    },
    followers: {
        type: Array,
        default: []
    },
    about: {
        type: String,
        max: 50,
    },
    city: {
        type: String,
        max: 50
    },
    country: {
        type: String,
        max: 50
    },
    relationship: {
        type: String,
        max: 50
    },
}, { timestamps: true });

module.exports = mongoose.model('users', userSchema);