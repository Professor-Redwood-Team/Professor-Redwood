const mongoose = require('mongoose')

const LocationSchema = new mongoose.Schema({
  channel: { type: String, lowercase: true },
  query: { type: String, lowercase: true },
  result: { type: String, lowercase: true }
})

module.exports = mongoose.model('Location', LocationSchema)
