const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    uniqueUrl: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('User', userSchema)