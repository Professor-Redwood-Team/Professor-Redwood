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

const tr = (data, message) => {
	let reply = '';

	let inNeighborhood = false;
	let usage = 'Command usage: **!tr pokemonName location details**';

	const msgSplit = message.content.toLowerCase().split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = 'Sorry, incorrect format. If you dont know what pokemon is at a location, use **?** for pokemonName\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	let pokemonName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());

	if (!pokemonInfo[pokemonName.toUpperCase()]) {
		reply = 'Sorry, pokemon not found. Please make sure to type the exact name of the pokemon and DO NOT USE THE @ tag. If you dont know what pokemon is at a location use **?** for pokemonName\n'+usage;
		message.channel.send(reply);
		return reply;
	}

	var pokemonTag = pokemonName; //generate a tag for the pokemon to alert users

	data.GUILD.roles.forEach((role) => {
		if (role.name === pokemonName) pokemonTag = '<@&' + role.id + '>'; //if the pokemon name is found as a role, put in mention format
		
		
	});
	
	var shadowTag = '';
    if (message.content.indexOf(pokemonName) > -1) {
        if (data.rolesByName['shadow']) {
            shadowTag = ' <@&' + data.rolesByName['shadow'].id + '> ';
        } 
    }
	

	let detail = message.content.substring(message.content.indexOf(' ',message.content.indexOf(' ') +1)+1);

	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Team GO Rocket sighting not processed, no location details.\n'+usage;
		message.channel.send(reply);
		return reply
	}
	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}

	reply = 'Team GO Rocket with ' + '**' + shadowTag.toUpperCase() + pokemonTag.toUpperCase() + '** ' + data.getEmoji(pokemonName) + ' spotted at ' + '**' + detail + '**' +' by ' + message.member.displayName;
	message.channel.send(reply);
	let forwardReply = '- Team GO Rocket with **SHADOW ' + pokemonName.toUpperCase() + '** ' + data.getEmoji(pokemonName) + ' spotted in ' + data.channelsByName[message.channel.name] + ' at ' + detail;

	if(!data.channelsByName['shadow_alerts'])
		console.log('Please create a channel called shadow_alerts to allow the !tr function to work');
	else if (message.channel.name !== 'shadow_alerts') {
		data.channelsByName['shadow_alerts'].send(forwardReply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return tr(data, message);
});