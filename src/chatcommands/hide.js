'use strict';

const CONSTANTS = require('./../constants');

const usage = 'Command usage: **!hide #channelName**';


const handleHide = (data, message) => {
	let reply = '';

	var hideUser = {
		VIEW_CHANNEL: false,
	};

	const channelLink = message.content.split(' ').slice(-1)[0].toLowerCase();
	if (!channelLink) {
		reply = 'Incorrect usage, you must specify a channel.\n' + usage;
		message.channel.send(reply);
		return reply;
	}

	let channelId = channelLink.substring(2,channelLink.length-1);
	let channel = data.GUILD.channels.cache.get(channelId);
	
	if (!channel) {
		if(data.channelsByName[channelLink])
			channel = data.channelsByName[channelLink];
		else {
			reply = 'I can\'t find that channel. Please make sure to use # to specify your channel name';
			message.channel.send(reply);
			return reply;
		}
	}

	if (CONSTANTS.PROTECTED_CHANNELS.indexOf(channel.name) == -1) {
		channel.createOverwrite(message.author, hideUser);
		reply = 'Hiding channel #' + channel.name + ' for user: ' + message.member.displayName;
	}
	else {
		reply = 'You can\'t hide a protected channel. Protected channels are: ' + CONSTANTS.PROTECTED_CHANNELS.join(', ');
	}
	//	message.delete();	
	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleHide(data, message);
});


