'use strict';

const CONSTANTS = require('./../constants');
const cp = require('../../data/cp.json');

/*
	Returns the minimum/maximum CP for encounters with the given Pokemon after a raid
*/
const raidCp = (data, message) => {
	let pokemon = message.content.split(' ').slice(-1)[0].toLowerCase();
	
	pokemon = CONSTANTS.standardizePokemonName(pokemon);
	let pokeCp = cp[pokemon];
	let reply;

	if (!pokeCp) {
		reply = 'Sorry, CP for ' + pokemon.capitalize() + ' isn\'t available at this time';
	} else {
		reply = '**' + pokemon.capitalize() + '** ' + data.getEmoji(pokemon) + ' Raid CP @ Lv20: [min: **' + pokeCp.min + '**, max: **' + pokeCp.max + '**]';
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return raidCp(data, message);
});
