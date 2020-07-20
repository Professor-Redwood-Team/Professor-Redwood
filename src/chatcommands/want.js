'use strict';

const CONSTANTS = require('./../constants');


const assignWant = (data, message) => {
	let reply = '';
	let wantedMon = message.content.split(' ').slice(-1)[0].toLowerCase();

	wantedMon = CONSTANTS.standardizePokemonName(wantedMon);

	if (CONSTANTS.MONS.indexOf(wantedMon) === -1 && CONSTANTS.RAIDMONS.indexOf(wantedMon) === -1 && CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) === -1 && 
		CONSTANTS.SPECIALMONS.indexOf(wantedMon) === -1 && CONSTANTS.SPECIALRAIDS.indexOf(wantedMon) === -1 && 
		CONSTANTS.EGGTIERS.indexOf(wantedMon) === -1 && CONSTANTS.QUESTREWARDS.indexOf(wantedMon) === -1 && CONSTANTS.PVP.indexOf(wantedMon) === -1) {
		reply = 'I\'m sorry, I can\'t find ' + wantedMon + '. Remember, you can only type one keyword at a time. Type `!want keyword`, where `keyword` is one item in any of the lists below:' + '\n' +
				'\n**Legendary Pokemon**: ' + CONSTANTS.LEGENDARYMONS.join('|') +
				'\n*legendary* - all Legendary Pokémon' + '\n' + '-----' +
				'\n**Egg Tiers**: ' + CONSTANTS.EGGTIERS.join('|') + '\n' + '-----' +
				'\n**Quest Rewards**: ' + CONSTANTS.QUESTREWARDS.join('|') + '\n' + '-----' +
				'\n**Raid Boss Pokemon**: ' + CONSTANTS.RAIDMONS.join('|') + '\n' + '-----' +
				'\n**Wild Pokemon**: ' + CONSTANTS.MONS.join('|') + '\n' + '-----' +
				'\n**Special Case**: ' + CONSTANTS.SPECIALMONS.join('|') +
				'\n*shadow* - all shadow Pokémon' + 
				'\n*highiv* - a wild spawn that a Trainer finds that is a 3* appraisal or 100%' +
				'\n*shinycheck* - a Pokémon that can potentially be shiny when encountered' +
				'\n*finalevo* - a wild spawn of a final evolution' + '\n' + '-----' +
				'\n**Special Raids**: ' + CONSTANTS.SPECIALRAIDS.join('|') + 
				'\n*exgym* - a Raid at an EX eligible Gym' + '\n' + '-----' +
				'\n**PVP**: ' + CONSTANTS.PVP.join('|') +
				'\n*pvp* -  receive notifications for the latest updates regarding PVP tournaments from tournament organizers' ;
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

	if (!currWantsMon) {
		message.member.addRole(data.rolesByName[wantedMon]);
		reply = 'OK ' + message.member.displayName + '! I will let you know when someone reports a ' + wantedMon; 
		if (CONSTANTS.SPECIALRAIDS.indexOf(wantedMon) !== -1 ||  CONSTANTS.EGGTIERS.indexOf(wantedMon) !== -1) {
			reply += ' raid.';
		} else if (CONSTANTS.QUESTREWARDS.indexOf(wantedMon) !== -1) {
			reply += ' quest.';	
		} else if (CONSTANTS.SPECIALMONS.indexOf(wantedMon) !== -1) {
			reply += ' pokemon.';
		} else {
			reply += ' in the wild, as a quest reward, as a shadow, or as a raid boss.';
		}
		reply += '\nRemember you can **run this command again to stop alerts** for ' + wantedMon + '.';

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
