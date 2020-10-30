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
		message.member.roles.add(data.rolesByName['allregions']);
		reply = `Welcome ${message.member.displayName} - Please read discord rules and learn bot commands in ${data.channelsByName['start_here']} before doing anything. For now, I've given you allregions. Run bot commands in ${data.channelsByName['professor_redwood']} and type **!help** for more information.`;
		message.channel.send(reply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return checkNew(data, message);
});
