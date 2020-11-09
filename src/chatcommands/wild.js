'use strict';

const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');
const { cleanUpDetails, getPokemonTag, getSpecialWildTag, removeExtraSpaces, sendAlertToChannel } = require('./../helper');

const wild = (data, message) => {
	let reply = '';
	let usage = 'Command usage: **!wild pokemonName location details**';

	const msgLower = message.content.toLowerCase();
	const msgSplit = msgLower.split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = `Sorry, incorrect format.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	const pokemonName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());
	if (!pokemonInfo[pokemonName.toUpperCase()]) {
		reply = `Sorry, pokemon not found. Please make sure to type the exact name of the pokemon and DO NOT USE THE @ tag.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}
	const pokemonTag = getPokemonTag(pokemonName, data);

	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	let detail = message.content.substring(message.content.indexOf(' ', message.content.indexOf(' ') + 1) + 1);
	if (!detail) {
		reply = `Wild sighting not processed, no location details.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}
	detail = cleanUpDetails(detail);

	const specialWildTag = getSpecialWildTag(msgLower, data);

	reply = removeExtraSpaces(`Wild **${pokemonTag.toUpperCase()}** ${data.getEmoji(pokemonName)} ${specialWildTag} at **${detail}** added by ${message.member.displayName}`);
	message.channel.send(reply);
	const forwardReply = `- **${pokemonName.toUpperCase()}** ${data.getEmoji(pokemonName)} reported in the wild in ${data.channelsByName[message.channel.name]} at ${detail}`;

	sendAlertToChannel('missing_dex', forwardReply, data);
	return reply;
};

module.exports = (data) => (message => wild(data, message));
