// This is a Linked List for each channel
// Each Node will have raids
'use strict'

const ActiveRaids = function() {
  this.head = null
  this.tail = null
}

/**
 * 
 * @param {Object} value - Object will contain { id, pokemon (string), time (string), location (string), attendees (int) }
 * @param {*} next 
 * @param {*} prev 
 */
const Raid = function(value, next, prev) {
  this.value = value
  this.next = next
  this.prev = prev
}

ActiveRaids.prototype.addToHead = function(value) {
  let newRaid = new Raid(value, this.head, null)

  if (this.head) {
    this.head.prev = newRaid
  }
  else {
    this.tail = newRaid
  }

  this.head = newRaid
}

ActiveRaids.prototype.addToTail = function(value) {
  let newRaid = new Raid(value, null, this.tail)

  if(this.tail) {
    this.tail.next = newRaid
  }
  else {
    this.head = newRaid
  }

  this.tail = newRaid
}