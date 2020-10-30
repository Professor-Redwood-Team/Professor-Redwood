'use strict';

const CONSTANTS = require('./../constants');


const assignPlay = (data, message) => {
	let reply = '';

	const wantedRegion = message.content.split(' ').slice(-1)[0].toLowerCase();

	if (CONSTANTS.REGIONS.indexOf(wantedRegion) === -1) {
		reply = 'I\'m sorry, I can\'t find ' + wantedRegion + '. Remember you can only type one region at a time. Please enter **!play ' + CONSTANTS.REGIONS.join('|') + '**';
		message.channel.send(reply);
		return reply;
	}

	var currHasRegion = false;
	var currHasAllRegions = false;
	if (message.member.roles.cache) {
		message.member.roles.cache.forEach( (role) => {
			if (!currHasRegion && role.name === wantedRegion) {
				currHasRegion = true;
			}
			if (!currHasAllRegions && role.name === 'allregions') {
				currHasAllRegions = true;
			}
		});
	}


	if(!currHasRegion) {
		message.member.roles.add(data.rolesByName[wantedRegion]);
		if(wantedRegion !== 'allregions' && currHasAllRegions) message.member.roles.remove(data.rolesByName['allregions']); //remove all regions since they've added a defined region
		reply = 'OK ' + message.member.displayName + '! I have you playing in the ' + wantedRegion + ' region';
	} else {
		message.member.roles.remove(data.rolesByName[wantedRegion]);
		reply = 'Oh? You already had ' + wantedRegion + ', so I\'ll remove it for you ' + message.member.displayName;
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return assignPlay(data, message);
});
