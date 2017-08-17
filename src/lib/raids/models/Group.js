const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
  group_id: { type: String, required: true},
  leader: { type: String, lowercase: true },
  players: [
    { type: String, unique: true }
  ],
  number_of_players: { type: Number, default: 0 },
  pokemon: { type: String, lowercase: true },
  location: { type: String },
  start_time: { type: Number, default: 0, required: true },
  start_time_string: { type: Date, required: true },
  formatted_time: { type: String, required: true },
  channel: { type: String }
})

module.exports = mongoose.model('Group', GroupSchema)