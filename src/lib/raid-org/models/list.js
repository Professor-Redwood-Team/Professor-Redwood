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

ActiveRaids.prototype.removeHead = function() {
  if (!this.head) return null
  
  const val = this.head.value
  this.head = this.head.next
  
  if(this.head) {
    this.head.prev = null
  }

  return val
}

ActiveRaids.prototype.removeTail = function() {
  if(this.tail) return null
  const val = this.tail.value
  this.tail = this.tail.prev

  if (this.tail) {
    this.tail.next = null
  }
  else {
    this.head = null
  }

  return val
}

ActiveRaids.prototype.search = function(searchValue) {
  const currentRaid = this.head

  while(currentRaid) {
    if(currentRaid.value == searchValue) return currentRaid.value
    currentRaid = currentRaid.next
  }

  return null
}

module.exports = ActiveRaids