'use strict';

const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');

const removeTags = (html) => {
	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

const wild = (data, message) => {
	let reply = '';

	let inNeighborhood = false;
	let usage = 'Command usage: **!wild pokemonName #channel location details**';

	if (message.channel.name.indexOf('-') > -1) {
		inNeighborhood = true;
		usage = 'Command usage: **!wild pokemonName location details**';
	}

	const msgSplit = message.content.toLowerCase().split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = 'Sorry, incorrect format.\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	let pokemonName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());

	if (!pokemonInfo[pokemonName.toUpperCase()]) {
		reply = 'Sorry, pokemon not found. Please make sure to type the exact name of the pokemon and DO NOT USE THE @ tag.\n'+usage;
		message.channel.send(reply);
		return reply;
	}

	var pokemonTag = pokemonName; //generate a tag for the pokemon to alert users

	data.GUILD.roles.forEach((role) => {
		if (role.name === pokemonName) pokemonTag = '<@&' + role.id + '>'; //if the pokemon name is found as a role, put in mention format
	});

	let channelName = message.channel.name;
	let detail = message.content.substring(message.content.indexOf(msgSplit[2]));
	if (!inNeighborhood) {
		let channelLink = detail.split(' ')[0];
		let channelId = channelLink.substring(2,channelLink.length-1);
		let channel = data.GUILD.channels.get(channelId);
		if(!channel) {
			if(data.channelsByName[channelLink])
				channelName = channelLink;
			else {
				reply = 'I can\'t find that channel. Please make sure to use # to specify your channel name or go to the neighborhood channel where this spawn is located,\n'+usage;
				message.channel.send(reply);
				return reply;
			}
		}
		else {
			channelName = channel.name;
		}
		detail = detail.substring(detail.indexOf(' ') + 1);
	}

	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Wild sighting not processed, no location details.\n'+usage;
		message.channel.send(reply);
		return reply
	}
	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}

	reply = 'Wild **' + pokemonTag.toUpperCase() + '** ' + data.getEmoji(pokemonName) + ' at ' + detail + ' added by ' + message.member.displayName;
	data.channelsByName[channelName].send(reply);
	let forwardReply = '- **' + pokemonName.toUpperCase() + '** ' + data.getEmoji(pokemonName) + ' reported in the wild in ' + data.channelsByName[channelName] + ' at ' + detail;

	if(!data.channelsByName['missing_dex'])
		console.log('Please create a channel called missing_dex to allow the !wild function to work');
	else if (message.channel.name !== 'missing_dex') {
		data.channelsByName['missing_dex'].send(forwardReply);
		if(!inNeighborhood) {
			message.channel.send(forwardReply); 
		}
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return wild(data, message);
});
