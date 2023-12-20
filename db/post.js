
const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    caption: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('posts', postSchema);