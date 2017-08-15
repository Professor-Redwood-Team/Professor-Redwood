'use strict'
const Groups = require('../lib/raids').Groups
const usage = {
  start: '** !group start <raid_id> <start_time> ** \n This command will automatically pull the location and information from the raid id',
  joingroup: '!group join <group_id> <number_of_additional_players (optional)> ',
  list: '!group list'
}

const groups = (data, message) => {
  let { content, channel, member } = message
  content = content.toLowerCase().split(' ')

  // List groups by channel - syntax !group list
  if(content.length === 2 && content.indexOf('list')) {
    Groups
      .listByChannel(channel.name)
      .then((groups) => {
        let list = groups.map(group => { `
          ** ${group.id} ** - ** ${group.pokemon} **
          ${'-'.repeat(10)}
          ** Players **: ${group.players}
          ** Number of Players ** :  ${group.number_of_players}
          ** Start Time: ${group.start_time}
          ** Location: ${group.location} 
          ** Reported: ${group.channel} ` 
        }).join('\n')
      })
      .catch((err) => { 
        channel.send(`An error has occured. Please check the command: ${usage.list}`)
      })
  }

  if (content.length >= 3) {
    // Start a group 
    // Syntax !group start <raid_id> <start_time> 
    if(content.indexOf('start') > 0 && content.indexOf('join') <= 0) {
      if(content[2].length === 4 && (isNaN(content[3]) === false)) {
        let id = content[2],
          author = member.displayName,
          { name } = channel,
          start_time = content[3]
        Groups
          .start(id, author, name, start_time)
          .then((group) => {
            let groupList = group.map(group => {
            `Group for ${group.pokemon} has started
            **ID** : **${group.id}**
            Start Time: ${group.start_time}
            Location: ${group.location} 
            Join: !group join ${group.id}`

          }).join('\n')
          channel.send(groupList)
        })
          .catch(err => channel.send(`Something went wrong with starting your group.
           Command is ${usage.start}`))    
      }

      // Join a group 
      // Syntax !group join <group_id> <num_of_players(optional)>
      if(content.indexOf('join') > 0 && content.indexOf('start') <= 0) {
        if(content[3].length === 4) {
          let id = content[2],
            author = member.displayName,
            { name } = channel,
            num_of_players = content[3] || 1

          Groups
            .joinGroup(id, author, name, num_of_players)
            .then(() => channel.send(`You've successfully joined Group ${id}! Good luck!`))
            .catch(() => channel.send(`Could not add you to group ${id}. Please check the group id, contact the leader, or check the ${usage.joingroup} `))
        }
      }

      // List Pokemon
      // Syntax !group list <pokemon>
      if (content.indexOf('list') > 0) {
        let { name } = channel,
          pokemon = content[2]
        Groups
          .listByPokemon(name, pokemon)
          .then(groups => {
            let groupList = groups.map(group => {
            `
            ** ${group.id} ** - ${group.pokemon}
            ** Players **   : ${group.num_of_players}
            ** Group **     : ${group.players}
            ** Location **  : ${group.location}
            ** Start Time **: ${group.start_time}
            `
          }).join('\n')
          channel.send(groupList)
        })
      }
    }
  }

}

module.exports = (data) => ( (message) => {
  return groups(data, message)
})