const mongoose = require('mongoose')

const PlayerSchema = require('./player')

const headcountSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: String,
    date: Date,
    totalPlayers: Number,
    isConfirmed: Boolean,
    details: String,
    players: [PlayerSchema]
});

module.exports = mongoose.model('Headcount', headcountSchema)