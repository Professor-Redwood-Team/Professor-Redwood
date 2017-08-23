'use strict';

const regionsConfig = require('../config/regions.json');
const secrets = require('../config/secrets.json');

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
	LEGENDARYMONS: ['articuno', 'moltres', 'zapdos', 'mew', 'mewtwo', 'lugia', 'ho-oh', 'celebi', 'entei', 'raikou', 'suicune'],
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
	HOOK: new Discord.WebhookClient(secrets.webhook.log.id, secrets.webhook.log.token)
};

//make this more elegant when we have more than one
data.standardizePokemonName = (name) => {
	name = name.toLowerCase();
	if (data.COMMON_MISSPELLINGS[name]) {
		name = data.COMMON_MISSPELLINGS[name];
	}
	return name;
};


module.exports = data;
