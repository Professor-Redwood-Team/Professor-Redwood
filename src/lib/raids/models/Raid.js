const mongoose = require('mongoose') 

const RaidSchema = new mongoose.Schema({
  id: { type: String, default: 0 },
  pokemon: { type: String, lowercase: true },
  formatted_time: { type: String },
  expiration_time: { type: Number },
  location: { type: String },
  channel: { type: String, required: true }
})

module.exports = mongoose.model('Raid', RaidSchema)