'use strict'

const Group = require('./models/Group')
const Raid = require('./models/Raid')
const rk = require('randomkey')
let date = new Date()

class Raids {
  constructor() {
    this.raids = null
  }
  /**
   * Add a raid to the Database
   * @param {Object} param0 - This will take an object of pokemon, start time in minutes as a Number, and the location details (can be google maps)
   */
  add({pokemon, expiration_time, location}) {
    return new Promise((resolve, reject) => {
      let raid = new Raid({ pokemon, expiration_time, location })    
      raid.save(err => { if(err) reject(err) })
      resolve(raid)
    })
  }

  /**
   * Returns a list of raids if available
   * Fallback message is included 
   * @param {string} channel - Takes the channel name
   */
  listByChannel(channel) {
    let current_time = date.setMinutes(date.getMinutes())
    return new Promise((resolve, reject) => {
      Raid.
        find({ channel }).where('expiration_time').gte(current_time).exec(err, data => {
          if (err) reject(err)
          if (data.length <= 0) reject(`No current raids reported in ${channel}, at this time`)
          if (data.length > 0) resolve(data)
        })
    })
  }

  listByPokemon(channel, pokemon) {
    let current_time = date.setMinutes(date.getMinutes())
    return new Promise((resolve, reject) => {
      Raid.
        find({ channel, pokemon }).where('expiration_time').gte(current_time).exec((err, data) => {
          if (err) reject(err)
          if (data.length <= 0) reject(`No current raids are reported for ${pokemon} in ${channel}, at this time`)
        })
    })
  }

  /**
   * This method is meant to remove all the expired raids from the Database
   */
  expire() {
    let current_time = date.setMinutes(date.getMinutes())
    this.raids.forEach((raid, index) => { 
      if (raid.expiration_time <= current_time){ raids.splice(i, 1) } 
    })
    // Raid.deleteMany({ expiration_time: { $lte: current_time } })
    //   .then(() => console.log(`Deleted raids after ${current_time}`))
    //   .catch(err => console.log(`Error at expire method: ${err}`))
  }
  

}

class Groups extends Raids {
  constructor(id) {
    this.id
  }
}

module.exports = {
  Raids,
  Groups
}