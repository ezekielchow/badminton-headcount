const mongoose = require('mongoose')

const PlayerSchema = require('./player')

const headcountSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    datetime: { type: Date, required: true },
    totalPlayers: { type: Number, required: true },
    isConfirmed: { type: Boolean, default: false },
    details: String,
    players: [PlayerSchema],
    password: String,
});

module.exports = mongoose.model('Headcount', headcountSchema)