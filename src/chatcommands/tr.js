'use strict';

const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');
const { cleanUpDetails, getPokemonTag, getShadowTag, removeTags, sendAlertToChannel } = require('./../helper');

const tr = (data, message) => {
	let reply = '';
	let usage = 'Command usage: **!tr pokemonName location details**';

	const msgSplit = message.content.toLowerCase().split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = `Sorry, incorrect format. If you dont know what Pokemon is at a location, use **?** for pokemonName\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	let pokemonName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());
	if (!pokemonInfo[pokemonName.toUpperCase()]) {
		reply = `Sorry, Pokemon not found. Please make sure to type the exact name of the Pokemon and DO NOT USE THE @ tag. If you don't know what Pokemon is at a location, use **?** for pokemonName\n'+usage`;
		message.channel.send(reply);
		return reply;
	}
	const pokemonTag = getPokemonTag(pokemonName, data);
	const shadowTag = getShadowTag(pokemonName, message, data);
	
	let detail = message.content.substring(message.content.indexOf(' ',message.content.indexOf(' ') +1)+1);
	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = `Team GO Rocket sighting not processed, no location details.\n${usage}`;
		message.channel.send(reply);
		return reply
	}
	detail = cleanUpDetails(detail);

	reply = `Team GO Rocket with **${shadowTag.toUpperCase()} ${pokemonTag.toUpperCase()}** ${data.getEmoji(pokemonName)} spotted at **${detail}** by ${message.member.displayName}`;
	message.channel.send(reply);
	const forwardReply = `- Team GO Rocket with **SHADOW ${pokemonName.toUpperCase()}** ${data.getEmoji(pokemonName)} spotted in ${data.channelsByName[message.channel.name]} at ${detail}`;

	sendAlertToChannel('shadow_alerts', forwardReply, data);

	return reply;
};

module.exports = (data) => (message => tr(data, message));
