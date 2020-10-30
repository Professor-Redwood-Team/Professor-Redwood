'use strict';

const CONSTANTS = require('./../constants');
const { cleanUpDetails, getRewardAndRewardTag, sendAlertToChannel } = require('./../helper');

const quest = (data, message) => {
	let reply = '';

	let inNeighborhood = false;
	let usage = 'Command usage: **!quest reward task location** *(rewards: tm, pokemon/wild (if not sure), rarecandy)';

	const msgLower = message.content.toLowerCase();
	const msgSplit = message.content.replace('\n', ' ').split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = 'Sorry, incorrect format.\n'+usage;
		message.channel.send(reply);
		return reply;
	}

	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	let detail = msgSplit.slice(2).join(' ');
	if (!detail) {
		reply = `Quest report not processed, not enough information.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}
	detail = cleanUpDetails(detail);

	// Send replies to appropriate channels
	const { reward, rewardTag } = getRewardAndRewardTag(msgSplit[1].toLowerCase(), msgLower, data);
	reply = `**QUEST ${rewardTag.toUpperCase()}** ${data.getEmoji(reward)}\nDetails: ${detail} added by ${message.member.displayName}`;
	message.channel.send(reply);
	const forwardReply = `- **${reward.toUpperCase()}** ${data.getEmoji(reward)} reported in ${data.channelsByName[message.channel.name]} at ${detail}`;

	// Send alert to #quests_alerts channel
	sendAlertToChannel('quests_alerts', forwardReply, data);

	// Send alert to regional alert channel
	message.channel.permissionOverwrites.forEach(role => {
		if (role.type !== 'role') return;

		const roleName = data.GUILD.roles.cache.get(role.id).name;
		// todo : get rid of SF reference
		if (CONSTANTS.REGIONS.indexOf(roleName) > -1 && roleName !== 'sf' && roleName !== 'allregions') {
			sendAlertToChannel(`quests_${roleName}`, forwardReply, data);
		}
	});

	return reply;
};

module.exports = (data) => (message => quest(data, message));