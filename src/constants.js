'use strict';

const Discord = require('discord.js');

const regionsConfig = require('../config/regions.json');
const secrets = require('../config/secrets.json');
const logger = require('../logger');

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
	MONS: ['aerodactyl', 'chansey', 'ditto', 'dratini', 'farfetch\'d', 'dragonite', 'girafarig', 'grimer', 'hitmonchan', 'hitmonlee', 'hitmontop',
		'machop', 'makuhita', 'mareep', 'miltank', 'onix', 'porygon', 'ralts', 'scyther', 'slakoth', 'tauros', 'togetic', 'larvitar', 'unown', 'zangoose', 'feebas',
		'wailmer', 'seviper', 'lotad', 'aron', 'trapinch', 'bagon', 'beldum', 'lileep', 'chimecho', 'anorith', 'lunatone'],
	EGGTIERS: ['tier3', 'tier4', 'tier5'],
	RAIDMONS: ['absol', 'aggron', 'alakazam', 'blastoise', 'charizard', 'gengar', 'lapras', 'machamp', 'mawile', 'rhydon', 'snorlax', 'tyranitar', 'venusaur', 'wailmer'],
	LEGENDARYMONS: ['legendary', 'articuno', 'moltres', 'zapdos', 'mew', 'mewtwo', 'lugia', 'ho-oh', 'celebi', 'entei', 'raikou', 'suicune', 'groudon', 'regirock', 'registeel', 'kyogre', 'rayquaza', 'latios', 'latias', 'jirachi', 'deoxys', 'regice'],
	SPECIALMONS: ['highiv', 'finalevo'],
	SPECIALRAIDS: ['exgym'],
	QUESTREWARDS: ['stardust', 'technical_machine', 'rarecandy', 'shinycheck'],
	REGIONS: regionsConfig.regions,
	COMMON_MISSPELLINGS: {
		'hooh': 'ho-oh',
		'milktank': 'miltank',
		'ttar': 'tyranitar',
		'unknown': 'unown',
		'raiku': 'raikou',
		'chancey': 'chansey',
		'tyrannitar': 'tyranitar',
		'slakoff': 'slakoth',
		'tm': 'technical_machine',
		'chargetm': 'technical_machine',
		'fasttm': 'technical_machine'
	},
	NSFW_WORDS: [' fuck ', ' fucking ', ' fuckin ', ' shit ', ' shitty '],
	PROTECTED_CHANNELS: ['start_here', 'professor_redwood', 'announcements'], // todo : move to a config file
	PROTECTED_ROLES: ['admin', 'mod', 'dev', 'VIP', '@everyone', 'timeout_inthecorner'], // todo : move to a config file
	PRIVILEGED_ROLES: ['admin', 'mod'],
};

const webhook = secrets.webhook.log.token ? new Discord.WebhookClient(secrets.webhook.log.id, secrets.webhook.log.token) : null;
data.log = (msg) => {
	if (webhook) {
		webhook.send(msg)
			.then()
			.catch(err => logger.error({ event: `Error with webhook ${err.message}`})); // eslint-disable-line
	} else {
		console.log(msg); // eslint-disable-line
	}
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
