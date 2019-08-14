'use strict';

const CONSTANTS = require('./../constants');

const removeTags = (html) => {
	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

const quest = (data, message) => {
	let reply = '';

	let inNeighborhood = false;
	let usage = 'Command usage: **!quest reward task location** *(rewards: tm, pokemon/wild (if not sure), rarecandy)';

	const msglower = message.content.toLowerCase();
	const msgSplit = message.content.toLowerCase().replace('\n', ' ').split(' ');
	if (!msgSplit || msgSplit.length < 3) {
		reply = 'Sorry, incorrect format.\n'+usage;
		message.channel.send(reply);
		return reply;
	}

	let detail = message.content.substring(message.content.indexOf(' ')+1);

	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Quest report not processed, not enough information.\n'+usage;
		message.channel.send(reply);
		return reply;
	}

	let reward = msgSplit[1].toLowerCase();
	const tms = ['chargetm','chargedtm','charged_tm','fast_tm','fasttm','tm','charge','charged','fast'];
	if (msglower.indexOf('rare cand') > -1 || msglower.indexOf('rarecand') > -1 || reward === 'rc' || reward === '1rc' || reward === '3rc') {		reward = 'rarecandy';
		//if(detail.toLowerCase().indexOf(' rc') > -1)
		//	detail = detail.substring(detail.toLowerCase().indexOf(' rc') + 3);
		//else if (detail.toLowerCase().indexOf('candy') > -1)
		//	detail = detail.substring(detail.toLowerCase().indexOf('candy') + 6);
	}
	else if (tms.indexOf(reward) > -1) {
		reward = 'technical_machine';
		//if (detail.toLowerCase().indexOf('tm ') > -1)
		//	detail = detail.substring(detail.toLowerCase().indexOf('tm ') + 3)
	}
	else if (msglower.indexOf('stardust') > -1 || msglower.indexOf('dust ') > -1) {
		reward = 'stardust';
		//detail = detail.substring(detail.toLowerCase().indexOf('dust') + 5);
	}
	else if (msglower.indexOf('silverpinap') > -1 || msglower.indexOf('silver p') > -1) {
		reward = 'silver_pinap';
	//detail = detail.substring(detail.toLowerCase().indexOf('silver p') + 8);

	}
	var rewardTag = reward; //generate a tag for the pokemon to alert users

	data.GUILD.roles.forEach((role) => {
		if (role.name === reward) rewardTag = '<@&' + role.id + '>'; //if the reward name is found as a role, put in mention format
	});

	//check to see if the message contains a mention of 'shiny'
	if (msglower.indexOf('shiny') > -1) {
		data.GUILD.roles.forEach((role) => {
			if (role.name === 'shinycheck') rewardTag += ' <@&' + role.id + '> ' + data.getEmoji('shiny'); //require a role called shinycheck
		});
	}

	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}

	reply = '**QUEST ' + rewardTag.toUpperCase() + '** ' + data.getEmoji(reward) + '\nDetails: ' + detail + ' added by ' + message.member.displayName;
	message.channel.send(reply);
	let forwardReply = '- **' + reward.toUpperCase() + '** ' + data.getEmoji(reward) + ' reported in ' + data.channelsByName[message.channel.name] + ' at ' + detail;

	message.channel.permissionOverwrites.forEach((role) => {
		if (role.type !== 'role') return;

		var roleName = data.GUILD.roles.get(role.id).name;
		// todo : get rid of SF reference
		if (CONSTANTS.REGIONS.indexOf(roleName) > -1 && roleName !== 'sf' && roleName !== 'allregions') {
			if (data.channelsByName['quests_' + roleName]) {
				data.channelsByName['quests_' + roleName].send(forwardReply);
			} else {
				console.warn('Please add the channel quests_' + roleName); // eslint-disable-line
			}
		}
	});

	if(!data.channelsByName['quests_alerts'])
		console.log('Please create a channel called quests_alerts to allow the !quest function to work');
	else if (message.channel.name !== 'quests_alerts') {
		data.channelsByName['quests_alerts'].send(forwardReply);
	}

	return reply;
};

module.exports = (data) => ( (message) => {
	return quest(data, message);
});
