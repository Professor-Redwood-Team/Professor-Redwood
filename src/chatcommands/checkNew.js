'use strict';

const CONSTANTS = require('./../constants');

const checkNew = (data, message) => {
	let reply = '';
	let grantAll = true;

	if (message.member.roles.cache) {
		message.member.roles.cache.forEach( (role) => {
			if (grantAll && CONSTANTS.REGIONS.indexOf(role.name) !== -1) {
				grantAll = false;
			}
		});
	}

	if (grantAll) {
	reply = `Welcome ${message.author} - Before doing anything, read discord rules in ${data.channelsByName['adventure_rules']} and learn bot commands in ${data.channelsByName['bot_commands']}. To see any of the channels, you need to: \n**1) Set your team** AND \n**2) Set your play region** \nFor instructions on how to do this, go to ${data.channelsByName['professor_redwood']} and type **!help** \n*NOTE: Make sure your status is NOT set to invisible, otherwise the bot will ignore your commands.*`; 
	message.channel.send(reply); 
	};

	return reply;
};

module.exports = (data) => ( (message) => {
	return checkNew(data, message);
});
