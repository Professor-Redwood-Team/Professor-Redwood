const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
  leader: { type: String, lowercase: true },
  players: [
    { type: String }
  ],
  number_of_players: { type: Number, default: 0 },
  pokemon: { type: String, lowercase: true },
  location: { type: String },
  start_time: { type: Number, default: 0 },
  channel: { type: String }
})

module.exports = mongoose.model('Group', GroupSchema)