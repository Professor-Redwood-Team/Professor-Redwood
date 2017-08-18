/* @flow */
'use strict';

const CONSTANTS = require('./../constants');

import type {Message} from 'discord.js';
import type {CommandData} from '../types';

const assignTeam = (data: CommandData, message: Message) => {
	let reply = '';

	if (message.member.roles) {
		message.member.roles.forEach( (role) => {
			if (CONSTANTS.TEAMS.indexOf(role.name) > -1) {
				reply = message.member.displayName + ', you already have a team assigned.';
			}
		});

		if (reply) {
			message.channel.send(reply);
			return reply;
		}
	}

	const newTeam = message.content.split(' ').slice(-1)[0].toLowerCase();
	if (CONSTANTS.TEAMS.indexOf(newTeam) > -1) {
		message.member.addRole(data.rolesByName[newTeam]);
		reply = 'Welcome ' + message.member.displayName + '! You now have access to ' + newTeam + '\'s private chat';
	} else {
		reply = message.member.displayName + ', please pick a correct team and type !team valor|mystic|instinct';
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data: CommandData) => ( (message: Message) => {
	return assignTeam(data, message);
});
