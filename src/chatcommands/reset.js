'use strict';

const CONSTANTS = require('./../constants');

const resetRoles = (data, message) => {
	let reply = 'You have no roles to reset ' + message.member.displayName;

	if (message.member.roles) {
		reply = message.member.displayName + ' I am removing the following roles:';

		message.member.roles.forEach( (role) => {
			if (CONSTANTS.PROTECTED_ROLES.indexOf(role.name) > -1) return;
			reply += ' ' + role.name;
			message.member.removeRole(role);
		});
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return resetRoles(data, message);
});
