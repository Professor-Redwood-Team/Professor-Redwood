'use strict'

const Channel = function(name, raids) {
  this.name = name 
  this.raids = raids || []
}

Channel.prototype.add = function(raid) {
  this.raids.push(raid)
  return this.raids.indexOf(raid)
}

Channel.prototype.list = function() {
  let result = []
  if(this.raids.length < 1) {
    return null
  }

  this.raids.forEach(raid => {
    result.push({
      id: raid.id,
      num_players: raid.num_players,
      time: raid.time
    })
  })

  return result
}

Channel