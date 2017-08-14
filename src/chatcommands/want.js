/* @flow */
'use strict';

const CONSTANTS = require('./../constants');


const assignWant = (data, message) => {
	let reply = '';
	let wantedMon = message.content.split(' ').slice(-1)[0].toLowerCase();

	wantedMon = CONSTANTS.standardizePokemonName(wantedMon);

	if (CONSTANTS.MONS.indexOf(wantedMon) === -1 && CONSTANTS.RAIDMONS.indexOf(wantedMon) === -1 && CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) === -1 && CONSTANTS.SPECIALMONS.indexOf(wantedMon) === -1) {
		reply = 'I\'m sorry, I can\'t find ' + wantedMon + '. Remember you can only type one pokemon\'s name at a time. Type **!want pokemonName** where pokemonName is one item in any of the lists below:' +
				'\n**Legendary Pokemon**: ' + CONSTANTS.LEGENDARYMONS.join('|') +
				'\n**Raid Boss Pokemon**: ' + CONSTANTS.RAIDMONS.join('|') +
				'\n**Wild Pokemon**: ' + CONSTANTS.MONS.join('|') +
				'\n**Special Case**: ' + CONSTANTS.SPECIALMONS.join('|') +
				'\nWhere *legendary* is any legendary pokemon' +
				'\nWhere *highiv* is a wild rare spawn that a user finds that is *amazing*, a *wonder*, or *can battle with the best of them*' +
				'\nWhere *finalevo* is a wild spawn of a final evolution';
		message.channel.send(reply);
		return reply;
	}

	var currWantsMon = false;
	if (message.member.roles) {
		message.member.roles.forEach( (role) => {
			if (!currWantsMon && role.name === wantedMon) {
				currWantsMon = true;
			}
		});
	}

	if(!currWantsMon) {
		message.member.addRole(data.rolesByName[wantedMon]);
		reply = 'OK ' + message.member.displayName + '! I will let you know when someone spots a ' + wantedMon + ' in the wild or as a raid boss';

	} else {
		message.member.removeRole(data.rolesByName[wantedMon]);
		reply = 'Oh? I will ignore ' + wantedMon + ' for you, ' + message.member.displayName;
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return assignWant(data, message);
});








