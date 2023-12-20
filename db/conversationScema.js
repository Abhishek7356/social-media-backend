
const mongoose = require('mongoose');
const conversationScema = new mongoose.Schema({
    member: {
        type: Array
    }
}, { timestamps: true });

module.exports = mongoose.model("conversation", conversationScema);