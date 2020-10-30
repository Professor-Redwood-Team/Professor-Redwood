'use strict';

const CONSTANTS = require('./../constants');

const handleMod = (data, message) => {
	let reply = '';
	let privileged = false;
	//improper pokemon tagging
	if (message.content.indexOf('<@&') > -1) {
		if (message.member) {
			if (message.member.roles.cache) {
				message.member.roles.cache.forEach( (role) => {
					if (CONSTANTS.PRIVILEGED_ROLES.indexOf(role.name) > -1)	{
						privileged = true;
					}
				});
			}
		}
		if (!privileged) {
			let roleid = message.content.substring(message.content.indexOf('<@&') + 3);
			if (roleid.indexOf(' ') > -1)
				roleid = roleid.substring(0, roleid.indexOf(' ')-1);
			else
				roleid = roleid.substring(0, roleid.length-1);
			data.GUILD.roles.cache.forEach((role) => {
				if (role.id == roleid) {
					let wantedMon = role.name;
					if (CONSTANTS.MONS.indexOf(wantedMon) > -1 || CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) > -1 || 
					CONSTANTS.EGGTIERS.indexOf(wantedMon) > -1) {
						reply = `**HEY** :rage: \nDo **NOT** use the @ tag when reporting. That's my job! Please use the appropriate commands (see ${data.channelsByName['bot_commands']}) instead.\nFor usage and rules, please read Rule#5 in ${data.channelsByName['adventure_rules']}. You have been warned!`;
						message.channel.send(reply);
					}
				} 
			});
		}
	}
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleMod(data, message);
});

