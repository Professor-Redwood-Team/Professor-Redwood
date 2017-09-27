'use strict';

const Discord = require('discord.js');
const FuzzySet = require('fuzzyset.js');

const regionsConfig = require('../config/regions.json');
const secrets = require('../config/secrets.json');
const pokemon = require('../config/pokemon.json');

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

const alphanumeric = (inputtxt) => {
	var letterNumber = /^[0-9a-zA-Z]+$/;
	return (inputtxt.value && inputtxt.value.match(letterNumber));
};

//Function and vars for sanitizing input
const tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

const tagOrComment = new RegExp(
	'<(?:'
	// Comment body.
	+ '!--(?:(?:-*[^->])*--+|-?)'
	// Special "raw text" elements whose content should be elided.
	+ '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
	+ '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
	// Regular name
	+ '|/?[a-z]'
	+ tagBody
	+ ')>',
	'gi');

const data = {
	BOTNAME: 'Professor Redwood',
	BOTID: secrets.discord.BOTID,
	TEAMS: ['valor', 'instinct', 'mystic'],
	MONS: ['aerodactyl', 'chansey', 'ditto', 'dratini', 'dragonite', 'girafarig', 'grimer', 'hitmonchan', 'hitmonlee', 'hitmontop',
		'machop', 'mareep', 'miltank', 'onix', 'porygon', 'scyther', 'tauros', 'togetic', 'larvitar', 'unown'],
	RAIDMONS: ['alakazam', 'blastoise', 'charizard', 'gengar', 'lapras', 'machamp', 'rhydon', 'snorlax', 'tyranitar', 'venusaur'],
	LEGENDARYMONS: pokemon.filter(p => p.legendary).map(p => p.name.toLowerCase()),
	ALLRAIDMONS: pokemon.filter(p => p.raid).map(p => p.name.toLowerCase()),
	WILDMONS: pokemon.filter(p => p.wild).map(p => p.name.toLowerCase()),
	ALLMONS: pokemon.map(p => p.name.toLowerCase()),
	SPECIALMONS: ['legendary', 'highiv', 'finalevo'],
	REGIONS: regionsConfig.regions,
	COMMON_MISSPELLINGS: {
		'hooh': 'ho-oh',
		'milktank': 'miltank',
		'ttar': 'tyranitar',
		'unknown': 'unown',
	},
	PROTECTED_CHANNELS: ['start_here', 'professor_redwood', 'announcements'], // todo : move to a config file
	PROTECTED_ROLES: ['admin', 'mod', 'dev', 'VIP', '@everyone', 'timeout_inthecorner'], // todo : move to a config file
};

const webhook = secrets.webhook.log.token ? new Discord.WebhookClient(secrets.webhook.log.id, secrets.webhook.log.token) : null;
data.log = (msg) => {
	if (webhook) {
		webhook.send(msg)
			.then()
			.catch(console.error); // eslint-disable-line
	} else {
		console.log(msg); // eslint-disable-line
	}
};

//make this more elegant when we have more than one
data.standardizePokemonName = (name, type) => {
	name = name.toLowerCase();
	if (data.COMMON_MISSPELLINGS[name]) {
		name = data.COMMON_MISSPELLINGS[name];
	}
	const mons = (type == 'wild') ? data.WILDMONS : 
		(type == 'raid') ? data.ALLRAIDMONS :
		data.ALLMONS;
	console.log(mons[name]);
	if (!mons[name]) {
		var fuzzy = new FuzzySet(mons, true);
		var results = fuzzy.get(name, name, .75);
		if (results && results.length == 1) {
			name = results[0][1];
		}
	}
	return name;
};


module.exports = data;
