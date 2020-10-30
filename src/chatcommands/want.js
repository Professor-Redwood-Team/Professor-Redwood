'use strict';

const CONSTANTS = require('./../constants');


const assignWant = (data, message) => {
	let reply = '';
	let wantedMon = message.content.split(' ').slice(-1)[0].toLowerCase();

	wantedMon = CONSTANTS.standardizePokemonName(wantedMon);

	if (CONSTANTS.MONS.indexOf(wantedMon) === -1 && CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) === -1 && 
		CONSTANTS.SPECIALMONS.indexOf(wantedMon) === -1 && CONSTANTS.SPECIALRAIDS.indexOf(wantedMon) === -1 && 
		CONSTANTS.EGGTIERS.indexOf(wantedMon) === -1 && CONSTANTS.QUESTREWARDS.indexOf(wantedMon) === -1 && CONSTANTS.PVP.indexOf(wantedMon) === -1 && CONSTANTS.LURES.indexOf(wantedMon) === -1 && CONSTANTS.TREXECUTIVES.indexOf(wantedMon) === -1) {
		reply = ' I can\'t find ' + wantedMon + '. Type `!want keyword`, where `keyword` is an item from the lists below:' + '\n' +
				'\n**Legendary and Mythical Pokémon**: ' + CONSTANTS.LEGENDARYMONS.join(' - ') + '\n' +
				'\n*legendary* - all Legendary and Mythical Pokémon' + '\n' + '-----' +
				'\n**Egg Tiers**: ' + CONSTANTS.EGGTIERS.join(' - ') + '\n' + '-----' +
				'\n**Quest Rewards**: ' + CONSTANTS.QUESTREWARDS.join(' - ') + '\n' + '-----' +
				'\n**Lures**: ' + CONSTANTS.LURES.join(' - ') + '\n' + '-----' +
				'\n**Pokémon**: ' + CONSTANTS.MONS.join(' - ') + '\n' + '-----' +
				'\n**Special Case**: ' + CONSTANTS.SPECIALMONS.join(' - ') + '\n' +
				'\n*shadow* - all shadow Pokémon' + 
				'\n*highiv* - a wild spawn that is a 3* appraisal or 100%' +
				'\n*shinycheck* - a Pokémon that may be shiny when encountered' +
				'\n*finalevo* - a wild spawn of a final evolution' + '\n' + '-----' +
				'\n**Special Raids**: ' + CONSTANTS.SPECIALRAIDS.join(' - ') + 
				'\n*exgym* - a Raid at an EX eligible Gym' + '\n' + '-----' +
				'\n**TR Leaders**: ' + CONSTANTS.TREXECUTIVES.join(' - ') + '\n' + '-----' +
				'\n**PVP**: ' + CONSTANTS.PVP.join(' - ') +
				'\n*pvp* -  receive notifications for the latest updates regarding PVP tournaments' ;
		message.channel.send(reply);
		return reply;
	}

	var currWantsMon = false;
	if (message.member.roles.cache) {
		message.member.roles.cache.forEach( (role) => {
			if (!currWantsMon && role.name === wantedMon) {
				currWantsMon = true;
			}
		});
	}

	if (!currWantsMon) {
		message.member.roles.add(data.rolesByName[wantedMon]);
		reply = `Ok ${message.member.displayName}! I will let you know when someone reports a ${wantedMon}.`;
		if (CONSTANTS.SPECIALRAIDS.indexOf(wantedMon) !== -1 ||  CONSTANTS.EGGTIERS.indexOf(wantedMon) !== -1) {
			reply += ' raid.';
		} else if (CONSTANTS.QUESTREWARDS.indexOf(wantedMon) !== -1) {
			reply += ' quest.';	
		} else if (CONSTANTS.SPECIALMONS.indexOf(wantedMon) !== -1) {
			reply += ' pokemon.';
		} else if (CONSTANTS.TREXECUTIVES.indexOf(wantedMon) !== -1) {
			reply += ' sighting.';
		} else if (CONSTANTS.LURES.indexOf(wantedMon) !== -1) {
			reply += ' lure.';
		} else {
			reply += ' in the wild, as a quest reward, as a shadow, or as a raid boss.';
		}
		reply += `\nRemember you can **run this command again to stop alerts** for ${wantedMon}`;

	} else {
		message.member.roles.remove(data.rolesByName[wantedMon]);
		reply = `Oh? I will ignore ${wantedMon} for you, ${message.member.displayName}`;
	}

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return assignWant(data, message);
});
