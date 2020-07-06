'use strict';

const CONSTANTS = require('./../constants');

function getMessageRemoveQuotedText(contentText) {
	if (contentText.startsWith("> ") || contentText.startsWith(">>> ")) {
		// quote starts with '> ' or '>>> ' and ends with newline
		// see: https://support.discord.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-
		if (contentText.indexOf('\n') > -1) {
			return contentText.substring(contentText.indexOf('\n') + 1);
		} else {
			// no newline in message, replay is only the quoted message!
			return ""
		}
	}

	return contentText;
}

const handleMod = (data, message) => {
	let reply = '';
	let privileged = false;
	let content = getMessageRemoveQuotedText(message.content)

	//improper pokemon tagging
	if (content.indexOf('<@&') > -1) {
		if (message.member) {
			if (message.member.roles) {
				message.member.roles.forEach( (role) => {
					if (CONSTANTS.PRIVILEGED_ROLES.indexOf(role.name) > -1)	{
						privileged = true;
					}
				});
			}
		}
		if (!privileged) {
			let roleid = content.substring(content.indexOf('<@&') + 3);
			if (roleid.indexOf(' ') > -1)
				roleid = roleid.substring(0, roleid.indexOf(' ')-1);
			else
				roleid = roleid.substring(0, roleid.length-1);
			data.GUILD.roles.forEach((role) => {
				if (role.id == roleid) {
					let wantedMon = role.name;
					if (CONSTANTS.MONS.indexOf(wantedMon) > -1 || CONSTANTS.RAIDMONS.indexOf(wantedMon) > -1 || CONSTANTS.LEGENDARYMONS.indexOf(wantedMon) > -1 || 
					CONSTANTS.EGGTIERS.indexOf(wantedMon) > -1) {
						reply = '**HEY** :rage: \nDo **NOT** use the @ tag when reporting Pokemon or Raids; that\'s my job! Please use the appropriate **!raid**, **!egg**, or **!wild** commands instead.\nFor usage and rules, please read Rule#5 in ' 
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
