const Location = require('../models')

module.exports = function(channel, location, response) {
  const newLocation = new Location({
    channel,
    query: location,
    result: response
  })
  
  newLocation.save((err) => { if(err) { throw new Error(err) } })
}