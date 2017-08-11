'use strict'

/**
 * This constructor sets up the structure and necessity of the raid
 * @param {string} author - Takes the message.channel.author value 
 * @param {string} id - Generates a new ID 
 * @param {Number} start_time - Time value
 */
const Group = function(author, id, start_time) {
  this.author = author
  this.id = id
  this.players = []
  this.num_players = this.players.length || 0
  this.start_time = start_time
}

// JOIN Command
/**
 * @param {string} player - Takes the message.channel.author value 
 * @param {Number} addtl - This is used in case additional players are accompanying said player that's joining
 */
Raid.prototype.add = function(player, addtl = 0) {
  this.players.push(player)
  // Case: Somebody says their joining but they are bringing X players or have X phones/accounts
  if (addtl > 0) {
    this.num_players += addtl
  }

  return this.num_players
}

module.exports = Group
