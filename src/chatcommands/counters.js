'use strict';

/* eslint-disable */

// See https://github.com/saucyallison/discordbot

const counters = require('../../data/counters.json');
const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');

function formatList(list, separator) {
	var listStr = "";
	for (var i=0; i<list.length; i++) {
		listStr = listStr + list[i] + separator + " "
	}
	return listStr.slice(0, (-1 * separator.length) - 1);
}
// Returns a String list of recommended counters for the given Pokemon
const getCounters = (data, message) => {
	let pokemon = message.content.split(' ').slice(-1)[0].toLowerCase();
    
    pokemon = CONSTANTS.standardizePokemonName(pokemon);
	var counterHash = counters[pokemon];
	var reply = "";

	if (!counterHash || Object.keys(counterHash).length == 0) {
		reply = "Sorry, counters for "+pokemon.capitalize()+" aren't available at this time";
		message.channel.send(reply);
		return reply;
	}
	for (var counter in counterHash) {
		// Underline when the counter Pokemon have movesets listed
		var u = "";
		if (Object.keys(counterHash[counter]).length > 0) {
			let isLegendary = true; // For now, having a hash bigger than 0 means it's legendary. No movesets for regular raid bosses yet
			u = "__";
			if ("stats" in counterHash) { // this is the updated format for Lugia only right now
				reply = "**" + pokemon.capitalize() + "** " + data.getEmoji(pokemon) + " ";
				// Raid boss stats (HP, CP)
				for (var stat in counterHash["stats"]) {
					reply = reply + stat + " **" + counterHash["stats"][stat] + "** | "
				}
				var info = pokemonInfo[pokemon.toUpperCase()];
				// Regular stats (Attack, Defense)
				reply += "Atk **" + info["stats"]["attack"] + "** | ";
				reply += "Def **" + info["stats"]["defense"] + "**";
				reply += "\n";
				// fast moves
				reply = reply + "[ " + formatList(counterHash["fast"], " /") + " -- ";
				// charge moves
				reply = reply + formatList(counterHash["charge"], " /") + " ]\n\n";
				// weaknesses
				reply = reply + "*Weaknesses*: " + formatList(counterHash["weaknesses"], ",") + "\n";
				// resistances
				reply = reply + "*Resistances*: " + formatList(counterHash["resistances"], ",") + "\n\n";
				// counters
				for (var counterType in counterHash["counters"]) {
					reply = reply + "**" + counterType + " Counters**\n";
					for (var pkmnName in counterHash["counters"][counterType]) {
						for (var i=0; i<counterHash["counters"][counterType][pkmnName].length; i++) {
							reply = reply + "- __" + pkmnName.capitalize() + "__: " + counterHash["counters"][counterType][pkmnName][i] + "\n";
						}
					}
					reply = reply + "\n";
				}
				message.channel.send(reply);
				return reply;
			}
		}
		reply = reply + "\n" + u + counter.capitalize() + u;
		for (var i=0; i<counterHash[counter].length; i++) {
			if (i == 0) reply = reply + "\n"; // add a newline between
			reply = reply + "- "+counterHash[counter][i]+"\n";
		}
	}

	reply = "Counters for **" + pokemon.capitalize() + "** " + data.getEmoji(pokemon) +"\n" + reply;
	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return getCounters(data, message);
});
