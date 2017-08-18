/* @flow */
'use strict';

const CONSTANTS = require('./../constants');
const cp = require('../../data/cp.json');
const {capitalize} = require('../utils');

import type {Message} from 'discord.js';
import type {CommandData} from '../types';

/*
	Returns the minimum/maximum CP for encounters with the given Pokemon after a raid
*/
const raidCp = (data: CommandData, message: Message) => {
	let pokemon = message.content.split(' ').slice(-1)[0].toLowerCase();

	pokemon = CONSTANTS.standardizePokemonName(pokemon);
	let pokeCp = cp[pokemon];
	let reply;

	if (!pokeCp) {
		reply = 'Sorry, CP for ' + capitalize(pokemon) + ' isn\'t available at this time';
	} else {
		reply = '**' + capitalize(pokemon) + '** ' + data.getEmoji(pokemon) + ' Raid CP @ Lv20: [min: **' + pokeCp.min + '**, max: **' + pokeCp.max + '**]';
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data: CommandData) => ( (message: Message) => {
	return raidCp(data, message);
});
