'use strict';

const Discord = require('discord.js');

const chatCommandsFunc = require('./chatrouter');
const CONSTANTS = require('./constants');
const logger = require('../logger');
const client = new Discord.Client();

const rolesByName = {};
const emojisByName = {};
const channelsByName = {};
var CHATCOMMANDS;
var GUILD;

// ** Helper functions: **
const getEmoji = (pokemon) => {
	var emoji = pokemon;
	if (pokemon === 'ho-oh') {
		emoji = 'hooh'; // special case for ho-oh
	}
	if (emojisByName[emoji]) {
		return '<:' + emoji + ':' + emojisByName[emoji].id + '>';
	}
	return '';
};

client.on('ready', (done) => {
	logger.info({ event: 'Ready!' });
	client.channels.forEach((channel) => {
		channelsByName[channel.name] = channel;
	});

	// todo : for the current design of the bot this is always a singleton
	client.guilds.forEach((guild) => {
		GUILD = guild;
	});

	if (GUILD) {
		GUILD.roles.forEach((role) => {
			rolesByName[role.name] = role;
		});
		GUILD.emojis.forEach((emoji) => {
			emojisByName[emoji.name] = emoji;
		});
	}

	CHATCOMMANDS = chatCommandsFunc({
		GUILD,
		rolesByName,
		channelsByName,
		getEmoji,
	});

	if (done) {
		done();
	} else {
		logger.info('Asynchronous data loaded!'); // eslint-disable-line
	}
});

client.on('message', (message, cb) => {
	if (!cb) cb = data => {return data;};

	if ((message.member && message.member.id === CONSTANTS.BOTID) ||
		(message.author && message.author.id === CONSTANTS.BOTID)) return;

	if (message.channel.type === 'dm' || message.channel.type === 'group') {
		message.channel.send('I currently have no direct message functions. Please go to channel #start_here');
		return;
	}

	//REMOVE AFTER TESTING
	//if (message.channel.name !== 'admin_testing') return;


	// todo : make the router do the routing
	
	let reply = '';
	const command = message.content.split(' ')[0].toLowerCase();
	// replace any multiple spaces with a single space
	while (message.content.indexOf('  ') > -1) {message.content = message.content.replace('  ', ' ');}

	if (message.member && command !== '!play')	{CHATCOMMANDS.checkNew(message);}
	CHATCOMMANDS.mod(message);
	
	if (message.content[0] !== '!') {
		return;
	}

	//Outside of Professor Redwood Channel, Message.member has NOT been null checked yet
	if (command === '!raid' || command === '!egg' || command === '!wild' || command === '!quest') {
		if (message.channel.name.indexOf('-') === -1) {
			reply = message.member.displayName + ', raid/egg/wild/quest commands should only be run in the corresponding neighborhood channel';
			message.channel.send(reply);
			return reply;
		}
		if (command === '!raid') {return cb(CHATCOMMANDS.raid(message));}
		else if(command === '!wild') {return cb(CHATCOMMANDS.wild(message));}
		else if(command === '!quest') {return cb(CHATCOMMANDS.quest(message));}
		else {return cb(CHATCOMMANDS.egg(message));}
	}
	//Inside Professor Redwood Channel, Do not touch message.member
	else if (message.channel.name !== 'professor_redwood') {
		if (message.channel.name.indexOf('-') > 0) //neighborhood channel
			message.channel.send(message.member.displayName + ', I don\'t recognize your entry in this channel\n' +
				'For raids, use **!raid boss timeLeft location**\n' +
				'For eggs, use **!egg tierNumber timeLeft location**\n' +
				'For quests, use **!quest reward task location**\n' +
				'For wild spawns, use **!wild pokemonName location**\n' +
				'For everything else, go to ' + channelsByName['professor_redwood'] + ' channel and type **!help**');
		else
			message.channel.send(message.member.displayName + ', I don\'t recognize your entry, you need to be in the channel for bot commands. Please click here: ' +
				channelsByName['professor_redwood'] + ' and type **!help**')
		return;
	}
	
	logger.info({ event: `${message.member.displayName} said ${message.content} in ${message.channel.name}` });

	if (command === '!breakpoint' || command === '!bp') {return cb(CHATCOMMANDS.breakpoint(message));}
	else if (command === '!cp') {return cb(CHATCOMMANDS.cp(message));}
	else if (command === '!counter' || command === '!counters') {return cb(CHATCOMMANDS.counters(message));}
	else if (command === '!help') {return cb(CHATCOMMANDS.help(message));}

	//Inside Professor Redwood Channel, OK to touch message.member
	if (reply === '' && !message.member) {
		message.channel.send('Member is a ' + getEmoji('gengar') + ' - Commands cannot be run for users who are invisible, please remove your invisible status');
		return;
	}

	if (command === '!play') {return cb(CHATCOMMANDS.play(message));}
	else if (command === '!hide') {return cb(CHATCOMMANDS.hide(message));}
	else if (command === '!team') {return cb(CHATCOMMANDS.team(message));}
	else if (command === '!want') {return cb(CHATCOMMANDS.want(message));}
	else if (command === '!reset') {return cb(CHATCOMMANDS.reset(message));}

	const errorMessage = 'Command not found: ' + command;
	logger.info({ event: `${command} was not understood `});
	CONSTANTS.log(errorMessage);
	return cb(errorMessage);
});

module.exports = client;
