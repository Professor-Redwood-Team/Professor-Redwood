'use strict';

const CONSTANTS = require('./../constants');

const handleMod = (data, message) => {
	let reply = '';
	let privileged = false;
	//improper pokemon tagging
	if (message.content.indexOf('<@&') > -1) {
		if (message.member) {
			if (message.member.roles) {
				message.member.roles.forEach( (role) => {
					console.log(role.name);
					if (CONSTANTS.PRIVILEGED_ROLES.indexOf(role.name) > -1)	{
						privileged = true;
					}
				});
			}
		}
		if (!privileged) {
			let roleid = message.content.substring(message.content.indexOf('<@&') + 3);
			roleid = roleid.substring(0, roleid.length-1);
			data.GUILD.roles.forEach((role) => {
				if (role.id == roleid) {
					let wantedMon = role.name;
					if (CONSTANTS.MONS.indexOf(wantedMon) > -1 || CONSTANTS.RAIDMONS.indexOf(wantedMon) > -1 || CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) > -1 || 
					CONSTANTS.SPECIALMONS.indexOf(wantedMon) > -1 || CONSTANTS.EGGTIERS.indexOf(wantedMon) > -1) {
						reply = '**HEY** :rage: \nDo **NOT** tag pokemon names with @ anymore, that\'s my job now. I will tag mons for you with the !raid or !wild commands.\nFor usage and rules, please read Rule#5 in ' 
							+ data.channelsByName['start_here'] + '. You have been warned!';
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
