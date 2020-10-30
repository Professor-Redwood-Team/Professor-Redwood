'use strict';

const CONSTANTS = require('./../constants');

const checkNew = (data, message) => {
	let reply = '';
	let grantAll = true;

	if (message.member.roles) {
		message.member.roles.forEach( (role) => {
			if (grantAll && CONSTANTS.REGIONS.indexOf(role.name) !== -1) {
				grantAll = false;
			}
		});
	}

	if (grantAll) {
		reply = 'Welcome ' + message.author + ' - Please read the discord rules in ' + data.channelsByName['adventure_rules'] + ' and learn bot commands in ' + data.channelsByName['bot_commands'] + ' before doing anything. To see any of the channels, you need to:' + '\n' + '**1) Set your team**  AND' + '\n' + '**2) Set your play region**' + '\n' + 'For instructions on how to do this, go to ' + data.channelsByName['professor_redwood']  + ' and type `!help`' + '\n' + '*NOTE: Make sure your status is NOT set to invisible, otherwise the bot will ignore your commands.*';
		message.channel.send(reply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return checkNew(data, message);
});
