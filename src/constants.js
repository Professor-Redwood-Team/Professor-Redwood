'use strict';

const Discord = require('discord.js');

const regionsConfig = require('../config/regions.json');
const secrets = require('../config/secrets.js');
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
	BOTID: process.env.DISCORD_CLIENTID,
	TEAMS: ['valor', 'instinct', 'mystic'],
	MONS: ['absol', 'aerodactyl', 'alomomola', 'archen', 'audino', 'axew', 'bagon', 'basculin', 'beedrill', 'beldum', 'blastoise', 'blissey', 'chansey', 'charizard', 'chimecho', 'cranidos', 'darumaka', 'deino', 'ditto', 'dragonite', 'dratini', 'drilbur', 'emolga', 'excadrill', 'feebas', 'ferroseed', 'gabite', 'gengar', 'gible', 'gyarados', 'heatmor', 'hitmonchan', 'hitmontop', 'houndoom', 'klink', 'lampent', 'lapras', 'larvitar', 'litwick', 'lunatone', 'machamp', 'machop', 'marowak', 'mawile', 'nincada', 'onix', 'panpour', 'pidgeot', 'porygon', 'raichu',  'ralts', 'scyther', 'seviper', 'shieldon', 'shinx', 'snorlax', 'spinda', 'spiritomb', 'tauros', 'throh', 'timburr', 'tirtouga', 'togetic', 'tyranitar', 'unown', 'venusaur', 'zweilous'],
	EGGTIERS: ['tier1', 'tier3', 'tier5', 'mega'],
	LEGENDARYMONS: ['legendary', 'articuno', 'azelf', 'cobalion', 'cresselia', 'darkrai', 'deoxys', 'dialga', 'entei', 'genesect', 'giratina', 'groudon', 'heatran', 'ho-oh', 'kyogre', 'kyurem', 'landorus', 'latias', 'latios', 'lugia', 'mewtwo', 'moltres', 'palkia', 'raikou', 'rayquaza', 'regice', 'regigigas', 'regirock', 'registeel', 'reshiram', 'suicune', 'terrakion', 'thundurus', 'tornadus', 'virizion', 'zapdos', 'zekrom'],
	SPECIALMONS: ['shadow', 'highiv', 'finalevo', 'shinycheck'],
	TREXECUTIVES: ['giovanni', 'arlo', 'cliff', 'sierra'],
	SPECIALRAIDS: ['exgym'],
	QUESTREWARDS: ['stardust', 'technical_machine', 'rarecandy', 'silver_pinap', 'sinnoh_stone','unova_stone'],
	LURES:  ['glacial_lure', 'magnetic_lure', 'mossy_lure'],
	PVP:  ['pvp'],
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
		'cresellia': 'cresselia',
		'creselia': 'cresselia',
		'hippopotamus': 'hippopotas',
		'hippo': 'hippopotas',
		'whismer': 'whismur',
		'taurus': 'tauros',
		'drillbur': 'drilbur',
		'excadril': 'excadrill',
		'feroseed': 'ferroseed',
		'gollett': 'golett',
		'nidoranf': 'nidoran_female',
		'nidoranm': 'nidoran_male',
		'verizion': 'virizion',
		'verizon': 'virizion',
		'timbur': 'timburr',
		'timber': 'timburr',
		'gyrados': 'gyarados',
		'venasaur': 'venusaur',
		'hounddoom': 'houndoom',
		'spirittomb': 'spiritomb',
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
