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
	let usage = 'Command usage: **!wild pokemonName location details**';

	const msglower = message.content.toLowerCase();
	const msgSplit = msglower.split(' ');
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

	let detail = message.content.substring(message.content.indexOf(' ',message.content.indexOf(' ') +1)+1);

	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Wild sighting not processed, no location details.\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}

	var specialWildTag = '';
	//tags role called highiv whenever 'highiv' is in a report
	if (msglower.indexOf('highiv') > -1) {
		data.GUILD.roles.forEach((role) => {
			if (role.name === 'highiv') specialWildTag += ' <@&' + role.id + '> '; //require a role called highiv
		});
	}
	//tags role called shinycheck whenever 'shiny' is in a report
	if (msglower.indexOf('shiny') > -1) {
		data.GUILD.roles.forEach((role) => {
			if (role.name === 'shinycheck') specialWildTag += ' <@&' + role.id + '> ' + data.getEmoji('shiny'); //require a role called shinycheck
		});
	}
	//tags role called finalevo whenever 'finalevo' is in a report
	if (msglower.indexOf('finalevo') > -1) {
		data.GUILD.roles.forEach((role) => {
			if (role.name === 'finalevo') specialWildTag += ' <@&' + role.id + '> '; //require a role called finalevo
		});
	}

	reply = 'Wild **' + pokemonTag.toUpperCase() + '** ' + data.getEmoji(pokemonName) + specialWildTag + ' at ' + detail + ' added by ' + message.member.displayName;
	message.channel.send(reply);
	let forwardReply = '- **' + pokemonName.toUpperCase() + '** ' + data.getEmoji(pokemonName) + ' reported in the wild in ' + data.channelsByName[message.channel.name] + ' at ' + detail;

	if(!data.channelsByName['missing_dex'])
		console.log('Please create a channel called missing_dex to allow the !wild function to work');
	else if (message.channel.name !== 'missing_dex') {
		data.channelsByName['missing_dex'].send(forwardReply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return wild(data, message);
});
