'use strict';

const CONSTANTS = require('./../constants');
const { cleanUpDetails, getEndTime, getSpecialRaidTag, getTierEmojiAndEggTag, sendAlertToChannel } = require('./../helper');

const usage = 'Command usage: **!egg tier# minutesLeft [exgym] location details**';

const egg = (data, message) => {
	let reply = '';

	const msglower = message.content.toLowerCase();
	const msgSplit = message.content.split(' ');
	if (!msgSplit || msgSplit.length < 4) {
		reply = `Sorry, incorrect format.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	const tier = parseInt(msgSplit[1]);
	if (isNaN(tier) || tier < 1 || tier > 5) {
		reply = `Sorry incorrect format. Ensure tier is a number between 1 and 5, use format:\n${usage}`;
		message.channel.send(reply);
		return;
	}

	const minutesLeft = parseInt(msgSplit[2]);
	if (isNaN(minutesLeft) || minutesLeft < 1 || minutesLeft > 120) {
		reply = `Raid not processed, ensure minutes remaining is a integer between 1 and 120.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	let detail = msgSplit.slice(3).join(' ');
	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Raid not processed, no location details. Use format:\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	detail = cleanUpDetails(detail);

	const { tierEmoji, eggTag } = getTierEmojiAndEggTag(tier, data);
	const channelName = message.channel.name;
	const endTime = getEndTime(minutesLeft);
	const specialRaidTag = getSpecialRaidTag(msglower, data);
	const hasExgymTag = message.content.includes('exgym') || message.content.includes('ex gym') || message.content.includes('ex raid');

	reply = `${data.getEmoji(tierEmoji)} ${eggTag} raid egg reported to ${data.channelsByName['gymraids_alerts']} (hatching: ${endTime}) at ${specialRaidTag} **${detail}** added by ${message.member.displayName}`;
	message.channel.send(reply);
	const forwardReply = `- ${data.getEmoji(tierEmoji)}**Tier ${tier}** egg reported in ${data.channelsByName[channelName]} hatching at ${endTime} at ${detail} ${hasExgymTag ? '**(EX gym)**' : ''}`;

	// Send alert to #gymraids_alerts channel
	sendAlertToChannel('gymraids_alerts', forwardReply, data);

	// Send alert to regional alert channel
	message.channel.permissionOverwrites.forEach((role) => {
		if (role.type !== 'role') return;

		const roleName = data.GUILD.roles.get(role.id).name;
		// todo : get rid of SF reference
		if (CONSTANTS.REGIONS.includes(roleName) && roleName !== 'sf' && roleName !== 'allregions') {
			if (data.channelsByName[`gymraids_${roleName}`]) {
				data.channelsByName[`gymraids_${roleName}`].send(forwardReply);
			} else {
				console.warn(`Please add the channel gymraids_${roleName}`); // eslint-disable-line
			}
		}
	});

	return reply;
};

module.exports = (data) => ( (message) => {
	return egg(data, message);
});
