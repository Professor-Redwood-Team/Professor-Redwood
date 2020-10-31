'use strict';

const CONSTANTS = require('./../constants');


const assignTeam = (data, message) => {
	let reply = '';

	if (message.member.roles.cache) {
		message.member.roles.cache.forEach( (role) => {
			if (CONSTANTS.TEAMS.indexOf(role.name) > -1) {
				reply = `${message.author}, you already have a team assigned. Run **!reset** to reset all of your roles on this discord.`;
			}
		});

		if (reply) {
			message.channel.send(reply);
			return reply;
		}
	}

	const newTeam = message.content.split(' ').slice(-1)[0].toLowerCase();
	if (CONSTANTS.TEAMS.indexOf(newTeam) > -1) {
		message.member.roles.add(data.rolesByName[newTeam]);
		reply = `Welcome ${message.author}! You now have access to ${newTeam}'s private chat.`;

	} else {
		reply = `${message.author}, to set your team, type **!team valor** OR **!team mystic** OR **!team instinct**`;
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return assignTeam(data, message);
});
