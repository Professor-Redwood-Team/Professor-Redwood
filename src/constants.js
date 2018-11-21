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
	MONS: ['aerodactyl', 'anorith', 'aron', 'bagon', 'beldum', 'blissey', 'chansey', 'chimecho', 'cranidos', 'ditto', 'dratini', 'farfetch\'d', 'feebas', 'dragonite', 'gible', 'girafarig', 'grimer', 'hitmonchan', 'hitmonlee', 'hitmontop', 'larvitar', 'lileep', 'lotad', 'lunatone', 'machop', 'makuhita', 'mareep', 'miltank', 'nincada', 'onix', 'porygon', 'ralts', 'seviper', 'scyther', 'slakoth', 'spinda', 'tauros', 'trapinch', 'togetic', 'unown', 'wailmer', 'zangoose'],
	EGGTIERS: ['tier3', 'tier4', 'tier5'],
	RAIDMONS: ['absol', 'aggron', 'alakazam', 'blastoise', 'charizard', 'gengar', 'kirlia', 'lapras', 'machamp', 'marowak', 'mawile', 'raichu', 'rhydon', 'shinx', 'snorlax', 'tyranitar', 'venusaur'],
	LEGENDARYMONS: ['legendary', 'articuno', 'azelf', 'celebi', 'cresselia', 'dialga', 'deoxys', 'entei', 'giratina', 'groudon', 'heatran', 'ho-oh', 'jirachi', 'kyogre', 'latias', 'latios', 'lugia', 'mesprit', 'mew', 'mewtwo', 'moltres', 'palkia', 'raikou', 'rayquaza', 'regice', 'regigigas', 'regirock', 'registeel', 'suicune', 'uxie', 'zapdos'],
	SPECIALMONS: ['highiv', 'finalevo'],
	SPECIALRAIDS: ['exgym'],
	QUESTREWARDS: ['stardust', 'technical_machine', 'rarecandy', 'shinycheck', 'silver_pinap'],
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
		'fasttm': 'technical_machine',
		'cresellia': 'cresselia',
		'creselia': 'cresselia',
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
