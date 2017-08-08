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
		message.member.addRole(data.rolesByName['allregions']);
		reply = 'Welcome ' + message.member.displayName + ' - I\'ve given you access to all neighborhood channels. Read more about the discord at ' +
			data.channelsByName['start_here'] +
			'. To filter out unwanted regions and neighborhood channels, go to ' + data.channelsByName['professor_redwood']  + ' and use the **!play** command or type **!help**';
		message.channel.send(reply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return checkNew(data, message);
});
