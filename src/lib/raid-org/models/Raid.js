'use strict'
/**
 * This constructor sets up the structure and necessity of the raid
 * @param {string} author - Takes the message.channel.author value 
 * @param {string} id - Generates a new ID 
 * @param {Number} time - Time Left
 * @param {string} location - Location detail (either text or google map link)
 */
const Raid = function(author, id, time, location) {
  this.author = author
  this.id = id
  this.time = time
  this.location = location
}

module.exports = Raid