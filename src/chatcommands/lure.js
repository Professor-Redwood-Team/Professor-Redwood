'use strict';

const lureInfo = require('../../data/lures.json');
const CONSTANTS = require('./../constants');

const removeTags = (html) => {
	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

const lure = (data, message) => {
	let reply = '';

	let inNeighborhood = false;
	let usage = 'Command usage: **!lure lureType location details**';

	const msglower = message.content.toLowerCase();
	const msgSplit = msglower.split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = 'Lure sighting not processed. `lureType` can be *mossy*, *glacial*, *magnetic*, or *normal* \n'+usage;
		message.channel.send(reply);
		return reply;
	}
	
	let lureName = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());

	if (!lureInfo[lureName.toUpperCase()]) {
		reply = 'Lure sighting not processed. `lureType` can be *mossy*, *glacial*, *magnetic*, or *normal* \n'+usage;
		message.channel.send(reply);
		return reply;
	}
	
	let detail = message.content.substring(message.content.indexOf(' ',message.content.indexOf(' ') +1)+1);

	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Lure sighting not processed. `lureType` can be *mossy*, *glacial*, *magnetic*, or *normal* \n'+usage;
		message.channel.send(reply);
		return reply
	}
	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}
	
	let lureType = msgSplit[1].toLowerCase();
	const magnetic = ['magnetic','magnet'];
	if (magnetic.indexOf(lureType) > -1) {
		lureType = 'magnetic_lure';
	}
	
	const mossy = ['grass','moss','mossy'];
	if (mossy.indexOf(lureType) > -1) {
		lureType = 'mossy_lure';
	}
	
	const glacial = ['glacial','ice','icy','snow'];
	if (glacial.indexOf(lureType) > -1) {
		lureType = 'glacial_lure';
	}
	
	const normal = ['normal','regular'];
	if (normal.indexOf(lureType) > -1) {
		lureType = 'normal_lure';
	}
	
	var lureTag = lureType; //generate a tag for the lure type to alert users
	data.GUILD.roles.cache.forEach((role) => {
		if (role.name === lureType) lureTag = '<@&' + role.id + '>'; //if the lureType is found as a role, put in mention format
	});

	reply = `**ACTIVE ${lureTag.toUpperCase()}** ${data.getEmoji(lureType)} reported by ${message.author.username} \nLocation: **${detail}**`;
	message.channel.send(reply);

	return reply;
};

module.exports = (data) => ( (message) => {
	return lure(data, message);
});
