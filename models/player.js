const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    name: String,
    isPaid: Boolean,
    numberOfFriends: Number
});

module.exports = playerSchema