'use strict'

const fs = require('fs')
const path = require('path')
const axios = require('axios')
const Location = require('./models')
const saveResult = require('./utils/query')
const coords = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config/location.json')))
const GOOGLE_API_KEY = require('../../../config/secrets.json').GOOGLE_API_KEY 

function mapChannel(channel) {
  for (var prop in coords) {
    if(channel.includes(prop)) return coords[prop]
  }
}

function placesLocation(location, channel, coords) {
  return new Promise((resolve, reject) => {
    const query = location.split(' ').join('+')
    axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&location=${coords}&radius=10000&key=${GOOGLE_API_KEY}`)
      .then(res => resolve(res.data.results[0].place_id))
      .catch(() => reject(location))
  })
}

function getUrl(id) {
  return new Promise((resolve, reject) => {
    axios.get(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${GOOGLE_API_KEY}`)
      .then(res => resolve(res.data.result.url))
      .catch(err => reject(err))
  })
}

/**
 * @param {string} location
 * @param {string} channel - This will be channel.name
 * @param {string} coords 
 */

module.exports = function getLocation(location, channel) {
  return new Promise((resolve, reject) => {
    const coords = mapChannel(channel)
      Location.
        findOne({ query: location }).
        where('channel').equals(channel).
        exec((err, data) => {
          if (err) reject(err)
          if (data == null) { 
            placesLocation(location, channel, coords)
              .then(id => {
                getUrl(id)
                  .then(url => { 
                    saveResult(channel, location, url)
                    resolve(url) 
                  })
              })
              .catch(location => reject(location))
          } 
          else {
            resolve(data.result)
          }
        })
  })
}