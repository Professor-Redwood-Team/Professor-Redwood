'use strict';

const CONSTANTS = require('./../constants');


const handleHelp = (data, message) => {
	let reply = '';

	reply = 'To gain access to chat, raid, and team channels, type on a single line: \n***!team mystic | valor | instinct***\n\n';
	reply += 'To assign a region that you play in and filter out unwanted channels, type on a single line: \n***!play ' + CONSTANTS.REGIONS.join('|');
	reply += '*** (one region at a time, region mapping can be found in ' + data.channelsByName['start_here'] + '\n\n';
	reply += 'To get alerts OR stop alerts for a specific pokemon, type on a single line: \n***!want pokemonName*** (type just **!want** for a list of available pokemon\n\n';
	reply += 'CP and best counters are now available for Tier 3-5 pokemon, simply type \n**!cp pokemonName** or **!counters pokemonName**\n\n';
	reply += 'Go to the ' + data.channelsByName['start_here'] + ' channel for information on Professor Willow assisting with raid tracking!\n\n';

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleHelp(data, message);
});
