'use strict';

const CONSTANTS = require('./../constants');

const usage = 'Command usage: **!egg tier# minutesLeft location details**';

//Format a date object as a string in 12 hour format
const format_time = (date_obj) => {
	// formats a javascript Date object into a 12h AM/PM time string
	var hour = date_obj.getHours();
	var minute = date_obj.getMinutes();
	const amPM = (hour > 11) ? 'pm' : 'am';
	if(hour > 12) {
		hour -= 12;
	} else if(hour === 0) {
		hour = '12';
	}
	if(minute < 10) {
		minute = '0' + minute;
	}
	return hour + ':' + minute + amPM;
};

const removeTags = (html) => {
	var oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

const egg = (data, message) => {
	let reply = '';

	const msgSplit = message.content.toLowerCase().split(' ');
	if (!msgSplit || msgSplit.length < 4) {
		reply = 'Sorry, incorrect format.\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	
	const tier = parseInt(msgSplit[1]);
	if (isNaN(tier) || tier < 1 || tier > 5) {
		reply = 'Sorry incorrect format. Ensure tier is a number between 1 and 5, use format:\n' + usage;
		message.channel.send(reply);
		return;
	}

	let tierEmoji = '';
	var eggTag = 'Tier ' + tier;
	if (tier == 5) {
		tierEmoji = 'legendaryraid';
		eggTag = ' <@&' + data.rolesByName['tier5'].id + '> ';
	}
	else if (tier > 2) {
		tierEmoji = 'rareraid';
		if(tier == 3) eggTag = ' <@&' + data.rolesByName['tier3'].id + '> ';
		if(tier == 4) eggTag = ' <@&' + data.rolesByName['tier4'].id + '> ';
	}
	else tierEmoji = 'normalraid'; 

	const channelName = message.channel.name;
	const minutesLeft = parseInt(msgSplit[2]);
	if (isNaN(minutesLeft) || minutesLeft < 1 || minutesLeft > 120) {
		reply = 'Raid not processed, ensure minutes remaining is a integer between 1 and 120.\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	var date = new Date(); //get today's date/time
	date.setMinutes(date.getMinutes() + minutesLeft); //add minutes remaining to get end time

	var twelveHrDate = format_time(date); //calc the friendly 12h date string for the UI

	//location information of raid
	var detail = message.content.substring(message.content.indexOf(minutesLeft.toString()) + minutesLeft.toString().length + 1);
	detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Raid not processed, no location details. Use format:\n'+usage;
		message.channel.send(reply);
		return reply;
	}
	if (detail.length > 255) {
		detail = detail.substring(0,255);
	}

	reply = eggTag + ' raid egg reported to ' + data.channelsByName['gymraids_alerts'] + ' (hatching: ' + twelveHrDate + ') at ' +
		detail + ' added by ' + message.member.displayName;
	message.channel.send(reply);
	let forwardReply = '- **Tier ' + tier + '** ' + data.getEmoji(tierEmoji) + ' egg reported in ' + data.channelsByName[channelName] + ' hatching at ' + twelveHrDate + ' at ' + detail;
	//send alert to #gymraids_alerts channel
	if (data.channelsByName['gymraids_alerts']) {
		data.channelsByName['gymraids_alerts'].send(forwardReply);
	} else {
		console.warn('Please add a channel called #gymraids_alerts'); // eslint-disable-line
	}

	//send alert to regional alert channel
	message.channel.permissionOverwrites.forEach((role) => {
		if (role.type !== 'role') return;

		var roleName = data.GUILD.roles.get(role.id).name;
		// todo : get rid of SF reference
		if (CONSTANTS.REGIONS.indexOf(roleName) > -1 && roleName !== 'sf' && roleName !== 'allregions') {
			if (data.channelsByName['gymraids_' + roleName]) {
				data.channelsByName['gymraids_' + roleName].send(forwardReply);
			} else {
				console.warn('Please add the channel gymraids_' + roleName); // eslint-disable-line
			}
		}
	});

	return reply;
};

module.exports = (data) => ( (message) => {
	return egg(data, message);
});