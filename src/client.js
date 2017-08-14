'use strict';

const Discord = require('discord.js');

const chatCommandsFunc = require('./chatrouter');
const CONSTANTS = require('./constants');

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

client.on('ready', () => {
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

	console.log('Asynchronous data loaded!'); // eslint-disable-line
	//done();
});

client.on('message', (message, cb) => {
	if (!cb) cb = data => {return data;};

	if ((message.member && message.member.id === CONSTANTS.BOTID) ||
		(message.author && message.author.id === CONSTANTS.BOTID)) return;

	if (message.channel.type === 'dm' || message.channel.type === 'group') {
		message.channel.send('I currently have no direct message functions. Please go to channel #start_here');
		return;
	}

	// todo : make the router do the routing

	if (message.content[0] !== '!') {
		if (message.member)	{CHATCOMMANDS.checkNew(message);}
		return;
	}

	let reply = '';
	const command = message.content.split(' ')[0];

	//Outside of Professor Redwood Channel, Message.member has NOT been null checked yet
	if (command === '!raid' || command === '!raids') {
		if (message.channel.name.indexOf('-') === -1) {
			reply = message.member.displayName + ', raid commands should only be run in the corresponding neighborhood channel';
			message.channel.send(reply);
			return reply;
		}
		if (command === '!raid') return cb(CHATCOMMANDS.raid(message));
		if (command === '!raids') return cb(CHATCOMMANDS.raids(message));
	}
	//Inside Professor Redwood Channel, Do not touch message.member
	else if (message.channel.name !== 'professor_redwood') {
		message.channel.send(message.member.displayName + ', you may only run this command in the ' + channelsByName['professor_redwood'] + ' channel');
		return;
	}

	//Inside Professor Redwood Channel, Do not touch message.member
	else if (message.channel.name !== 'professor_redwood') {
		message.channel.send(message.member.displayName + ', you may only run this command in the ' + channelsByName['professor_redwood'] + ' channel');
		return;
	}

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
	else if (command === '!team') {return cb(CHATCOMMANDS.team(message));}
	else if (command === '!want') {return cb(CHATCOMMANDS.want(message));}
	else if (command === '!reset') {return cb(CHATCOMMANDS.reset(message));}

});

module.exports = client;
