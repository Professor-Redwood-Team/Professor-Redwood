'use strict'
const Groups = require('../lib/raids').Groups
const usage = {
  start: '** !group start <raid_id> <start_time> ** \n This command will automatically pull the location and information from the raid id',
  joingroup: '!group join <group_id> <number_of_additional_players (optional)> ',
  list: '!group list'
}

// Stole this from raids
const format_time = (date_obj) => {
	// formats a javascript Date object into a 12h AM/PM time string
	var hour = date_obj.getHours();
	var minute = date_obj.getMinutes();
	const amPM = (hour > 11) ? 'pm' : 'am';
	if(hour > 12) {
		hour -= 12;
	} else if(hour === 0) {
		hour = '12';
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	return hour + ':' + minute + amPM;
};


const groups = (data, message) => {
  let { content, channel, member } = message
  content = content.split(' ')
  
  if (content.lastIndexOf('!group', 0) === 0) {
    if (content.length === 2 && content.indexOf('list') === 1) {
      Groups
        .listByChannel(channel.name)
        .then(groups => {
          let list = groups.map(group => `
            ** ${group.group_id} ** - ** ${group.pokemon} **
            ${'-'.repeat(10)}
            ** Players **: ${group.players.join(',')}
            ** Number of Players ** :  ${group.number_of_players}
            ** Start Time **: ${group.formatted_time}
            ** Location **: ${group.location} 
            ** Reported **: ${group.channel} ` 
          ).join('\n')
        channel.send(list)
    })
    .catch((err) => { 
      channel.send(`Error: ${err}`)
    })
  }
    
  if (content.length >= 3) {
    // Start a group 
    // Syntax !group start <raid_id> <start_time> 
    if(content.indexOf('start') > 0 && content.indexOf('join') <= 0) {
      if(content[2].length === 4 && (isNaN(content[3]) === false)) {
        let id = content[2],
        author = member.displayName,
        { name } = channel
        
        let d = new Date(),
        start_time = d.setMinutes(d.getMinutes() + Number(content[3]))
  
        let start_time_string = d.toString(),
        num_of_players = content[4] || 0,
        formatted_time = format_time(d)
        // need 
  
        Groups
          .start(id, author, name, start_time, start_time_string, formatted_time, num_of_players)
          .then((group) => {
            let groupList = `Group for ${group.pokemon} has started
            **ID** : **${group.group_id}**
            Start Time: ${group.formatted_time}
            Location: ${group.location} 
            Join: !group join ${group.group_id}`
            
            channel.send(groupList)
          })
          .catch(err => 
            //   channel.send(`Something went wrong with starting your group.
            //  Command is ${usage.start}`)
            channel.send(`Error: ${err}`)
          )    
        }
        
        // Join a group 
        // Syntax !group join <group_id> <num_of_players(optional)>
        
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
  // List groups by channel - syntax !group list
  if(content.indexOf('join') === 1) {
    let id = content[2],
      author = member.displayName,
      num_of_players = content[3] || 1

    Groups
      .joinGroup(id, author, channel.name, num_of_players)
      .then(() => channel.send(`You've successfully joined Group ${id}! Good luck!`))
      .catch((err) => console.log(err))
      // channel.send(`Could not add you to group ${id}. Please check the group id, contact the leader, or check the ${usage.joingroup} `))
  }

}

module.exports = (data) => ( (message) => {
  return groups(data, message)
})