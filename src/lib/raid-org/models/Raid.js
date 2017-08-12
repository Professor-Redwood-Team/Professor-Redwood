'use strict'

const mongoose = require('mongoose') 

const RaidSchema = new mongoose.Schema({
  id: { type: Number, default: 0 },
  pokemon: { type: String, lowercase: true },
  expiration_time: { type: Number },
  location: { type: String},
  channel: { type: String }
})

module.exports = mongoose.model('Raid', RaidSchema)