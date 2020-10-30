'use strict';

const CONSTANTS = require('./../constants');

const resetRoles = (data, message) => {
	let reply = 'You have no roles to reset ' + message.member.displayName;

	if (message.member.roles.cache) {
		var found = false;
		//reset user roles
		message.member.roles.cache.forEach( (role) => {
			if (CONSTANTS.PROTECTED_ROLES.indexOf(role.name) == -1) {
				if(!found) reply = message.member.displayName + ', I am removing the following roles:';
				found = true;
				reply += ' ' + role.name;
				message.member.roles.remove(role).catch(console.error);
			}
		});

		found = false;
		// reset channel overwritten permissions
		Object.keys(data.channelsByName).forEach((channelName) => {
			let channel = data.channelsByName[channelName];
			if(channel.name.indexOf('-') > -1) {
				let foundOverwrite = channel.permissionOverwrites.get(message.author.id);
				if(foundOverwrite) {
					if(!found) reply += '\n' + message.member.displayName + ', I am unhiding these neighborhood channels: ';
					found = true; // do not repeat found message
					reply += `#${channel.name}`;
					foundOverwrite.delete();
				}
			}
		});	
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return resetRoles(data, message);
});
