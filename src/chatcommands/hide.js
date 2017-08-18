'use strict';

const CONSTANTS = require('./../constants');


const handleHide = (data, message) => {
	let reply = '';

	var hideUser = {
			'READ_MESSAGES' : false
		};
	if(message.channel.name.indexOf('-') > -1) {
		message.channel.overwritePermissions(message.author, hideUser);
		reply = 'Hiding channel ' + message.channel.name + ' for user: ' + message.member.displayName;
		console.log(reply);
	}
	else {
		reply = 'This channel cannot be hidden - Only neighborhood channels with - in their name may be hidden';
		message.channel.send(reply);
	}
	message.delete();	
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleHide(data, message);
});


