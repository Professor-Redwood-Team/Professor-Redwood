'use strict';

const pokemonInfo = require('../../data/pokemon.json');
const trleaderInfo = require('../../data/trExecutives.json');
const CONSTANTS = require('./../constants');
const { cleanUpDetails, getPokemonTag, getTrShinyTag, getShadowTag, removeExtraSpaces, removeTags, sendAlertToChannel } = require('./../helper');

const tr = (data, message) => {
	let reply = '';
	let usage = 'Command usage: **!tr pokemonOrLeaderName location details**';

	const msgSplit = message.content.toLowerCase().split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = `Sorry, incorrect format. If you dont know what pokémon a Grunt has at a location, use **?** for pokemonName\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	let pokemonName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());
	if (!pokemonInfo[pokemonName.toUpperCase()] && !trleaderInfo[pokemonName.toUpperCase()]) {
		reply = `Sorry, Pokemon not found. Please make sure to type the exact name of the Pokemon and DO NOT USE THE @ tag. If you dont know what pokémon a Grunt has at a location, use **?** for pokemonName\n${usage}`;
		message.channel.send(reply);
		return reply;
	}
	const pokemonTag = getPokemonTag(pokemonName, data);
	const shadowTag = getShadowTag(pokemonName, message, data);
	const trShinyTag = getTrShinyTag(pokemonName, message, data);
	const trLeaderPresent = (pokemonName == 'arlo' || pokemonName == 'cliff' || pokemonName == 'sierra' || pokemonName == 'giovanni');
	
	let detail = message.content.substring(message.content.indexOf(' ',message.content.indexOf(' ') +1)+1);
	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = `Team GO Rocket sighting not processed, no location details.\n${usage}`;
		message.channel.send(reply);
		return reply
	}
	detail = cleanUpDetails(detail);

	let trLeaderPokemon = '';
		if (pokemonName == 'cliff') {trLeaderPokemon = 'meowth';
		} else if (pokemonName == 'sierra') {trLeaderPokemon = 'sneasel';
		} else if (pokemonName == 'giovanni') {trLeaderPokemon = 'zapdos';
		} else if (pokemonName == 'arlo') {trLeaderPokemon = 'scyther';}
		
	let trLeaderPokemonTag = trLeaderPokemon;
	data.GUILD.roles.forEach((role) => {
		if (role.name === trLeaderPokemon){
			trLeaderPokemonTag = '<@&' + role.id + '>'; //if the TR boss' pokemon is found as a role, put in mention format
		}
	});
	
	if (trLeaderPresent)
	{reply = removeExtraSpaces(`Team GO Rocket **${pokemonTag.toUpperCase()}** ${data.getEmoji(pokemonName)} with ${trShinyTag}${shadowTag} **${trLeaderPokemonTag.toUpperCase()}** ${data.getEmoji(trLeaderPokemon)} reported at **${detail}** by ${message.member.displayName}`);
	} else {reply = removeExtraSpaces(`Team GO Rocket Grunt with ${shadowTag} **${pokemonTag.toUpperCase()}** ${data.getEmoji(pokemonName)} reported at **${detail}** by ${message.member.displayName}`)};
	message.channel.send(reply);

	let forwardReply = '';
	if (trLeaderPresent)
	{forwardReply =  `- **LEADER ${pokemonName.toUpperCase()}** ${data.getEmoji(pokemonName)} reported in ${data.channelsByName[message.channel.name]} at ${detail}`;
	} else {forwardReply = `- GRUNT with **SHADOW ${pokemonName.toUpperCase()}** ${data.getEmoji(pokemonName)} reported in ${data.channelsByName[message.channel.name]} at ${detail}`};
	
	
	//send alert to #tr_alerts channel
	sendAlertToChannel('tr_alerts', forwardReply, data);

	// Send alert to regional alert channel
	message.channel.permissionOverwrites.forEach((role) => {
		if (role.type !== 'role') return;

		const roleName = data.GUILD.roles.cache.get(role.id).name;
		if (CONSTANTS.REGIONS.includes(roleName) && roleName !== 'sf' && roleName !== 'allregions') {
			sendAlertToChannel(`tr_alerts_${roleName}`, forwardReply, data);
		}
	});

	return reply;
};

module.exports = (data) => ( (message) => {
	return tr(data, message);
});