'use strict';

const CONSTANTS = require('./../constants');
const cp = require('../../data/cp.json');

function formatList(list, separator) {
	var listStr = '';
	for (var i=0; i<list.length; i++) {
		listStr = listStr + list[i] + separator + ' ';
	}
	return listStr.slice(0, (-1 * separator.length) - 1);
}
/*
	Returns the minimum/maximum CP for encounters with the given Pokemon after a raid
*/
const raidCp = (data, message) => {
	let pokemon = message.content.split(' ').slice(-1)[0].toLowerCase();
	
	pokemon = CONSTANTS.standardizePokemonName(pokemon);
	let pokeCp = cp[pokemon];
	let reply;

	if (!pokeCp) {
		if (pokemon == message.content) {
			reply = 'I\'m sorry, I didn\'t detect a pokemon name.';
		} else {
			reply = 'Sorry, CP for ' + pokemon.capitalize() + ' isn\'t available at this time';
		}
		reply += ' Please enter **!cp** ***pokemonName***';
	} else {
		reply = '**' + pokemon.capitalize() + data.getEmoji(pokemon) + '**';
		reply += ' (Catch Rate: ' + pokeCp.catchrate + ')\n';
		reply += 'Raid CP @ Lv20: [min: **' + pokeCp.lv20.min + '**, max: **' + pokeCp.lv20.max + '**]\n';
		reply += 'Raid CP @ Lv25: [min: **' + pokeCp.lv25.min + '**, max: **' + pokeCp.lv25.max + '**]\n';
		reply += '   __Weather__: ' + formatList(pokeCp['weather'], ', ');
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return raidCp(data, message);
});
