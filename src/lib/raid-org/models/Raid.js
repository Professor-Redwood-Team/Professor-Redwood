const Raid = function(author, id, time) {
  this.author = author
  this.id = id
  this.players = []
  this.num_players = this.players.length || 0
  this.time = time
}

// JOIN
Raid.prototype.add = function(player, addtl = 0) {
  this.players.push(player)
  // Case: Somebody says their joining but they are bringing X players or have X phones/accounts
  if (addtl > 0) {
    this.num_players += 3
  }

  return this.num_players
}