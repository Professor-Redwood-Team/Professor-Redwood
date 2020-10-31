'use strict';

const pokemonInfo = require('../../data/pokemon.json');
const CONSTANTS = require('./../constants');
const { cleanUpDetails, getEndTime, getLegendaryTag, getSpecialRaidTag, removeExtraSpaces, sendAlertToChannel } = require('./../helper');

const usage = 'Command usage: **!raid boss minutesRemaining [exgym] location details**';

const raid = (data, message) => {
	let reply = '';

	const msglower = message.content.toLowerCase();
	const msgSplit = message.content.split(' ');
	if (!msgSplit || msgSplit.length < 4) {
		reply = `Sorry, incorrect format.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	let boss = CONSTANTS.standardizePokemonName(msgSplit[1].toLowerCase());
	if (!pokemonInfo[boss.toUpperCase()]) {
		reply = `Sorry, boss not found. Please make sure to type the exact name of the raid boss and DO NOT USE THE @ tag.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	let bossTag = boss; // Generate a tag for the boss to alert users
	data.GUILD.roles.cache.forEach(role => {
		if (role.name === boss) {
			bossTag = '<@&' + role.id + '>'; // If the boss name is found as a role, put in mention format
		} else if (boss.substring(0,3) === '<@&') {
			if (role.id === boss.substring(3, boss.length - 4)) { // If the user already mentioned the boss, strip the @ so as to not notify additionally
				bossTag = role.name;
				boss = role.name;
			}
		}
	});

	const minutesLeft = parseInt(msgSplit[2]);
	if (isNaN(minutesLeft) || minutesLeft < 1 || minutesLeft > 120) {
		reply = `Raid not processed, ensure minutes remaining is a integer between 1 and 120.\n${usage}`;
		message.channel.send(reply);
		return reply;
	}

	//clean the date variable into a UTC object compatible with mysql and discord. this may no longer be required
	/*date = date.getUTCFullYear() + '-' +
			('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
			('00' + date.getUTCDate()).slice(-2) + ' ' +
			('00' + date.getUTCHours()).slice(-2) + ':' +
			('00' + date.getUTCMinutes()).slice(-2) + ':' +
			('00' + date.getUTCSeconds()).slice(-2);
	*/
	
	let detail = msgSplit.slice(3).join(' ');
	//detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql;
	if (!detail) {
		reply = 'Raid not processed, no location details. Use format: **!raid boss minutesRemaining [sponsored] [park] location details**';
		message.channel.send(reply);
		return reply;
	}
	detail = cleanUpDetails(detail);

	//var sql = 'INSERT INTO raids (boss, channel, endTime, detail) VALUES (\'' + boss + '\', \'' + channelId + '\', \'' + date.toString() + '\', \'' + detail + '\');';
	//console.log(sql); //currently logging all sql to the console for testing purposes
	/* not connecting to the database for now
	db.query(sql, function(err, result) {
		if (err) {
			console.log(err + '\n' + sql);
			} else {
			message.channel.send('Processed Raid #' + result.insertId + ' as ' + bossTag + ' (ending: ' + endTime + ') at ' + detail + ' added by ' + message.member.displayName);
		}
	});
	*/

	const legendaryTag = getLegendaryTag(boss, CONSTANTS.LEGENDARYMONS, data);
	const channelName = message.channel.name;
	const endTime = getEndTime(minutesLeft);
	const specialRaidTag = getSpecialRaidTag(msglower , data);
	const hasExgymTag = message.content.includes('exgym') || message.content.includes('ex gym') || message.content.includes('ex raid');

	// Send replies to appropriate channels
	reply = removeExtraSpaces(`${data.getEmoji(boss)} **${bossTag.toUpperCase()}** ${legendaryTag} raid reported to ${data.channelsByName['gymraids_alerts']} (ending: ${endTime}) at ${specialRaidTag} **${detail}** ${jppTag} added by ${message.author.username}`);
	message.channel.send(reply);
	const forwardReply = `- ${data.getEmoji(boss)} **${boss.toUpperCase()}** raid reported in ${data.channelsByName[channelName]} (ending ${endTime}) at ${detail} ${hasExgymTag ? '**(EX gym)**' : ''}`;

	// Send alert to #gymraids_alerts channel
	sendAlertToChannel('gymraids_alerts', forwardReply, data);

	// Send alert to regional alert channel
		message.channel.permissionOverwrites.forEach((role) => {
		if (role.type !== 'role') return;

		const roleName = data.GUILD.roles.cache.get(role.id).name;
		// todo : get rid of SF reference
		if (CONSTANTS.REGIONS.includes(roleName) && roleName !== 'sf' && roleName !== 'allregions') {
			sendAlertToChannel(`gymraids_${roleName}`, forwardReply, data);
		}
	});

	return reply;
};

/*	else if (message.content.substring(0,8) == '!raidegg') {
 if (message.channel.id == CHANNEL_IDS['#gymraids-alerts'] || message.channel.id == CHANNEL_IDS['#gymraids-meetups']) {
 message.channel.send(message.member.displayName + ', raid commands should only be run in the corresponding neighborhood channel');
 return;
 }
 const tier = message.content.split(' ')[1];
 var tierNum = parseInt(tier);
 if (isNaN(tierNum)) {
 message.channel.send('Raid not processed, use format: !raidegg [tierNumber] [minutesUntilHatch] [location details]');
 return;
 }

 const channelId = message.channel.id;
 const minutesToStart = parseInt(message.content.split(' ')[2]);
 if (isNaN(minutesToStart)) {
 message.channel.send('Raid not processed, use format: !raidegg [tierNumber] [minutesUntilHatch] [location details]');
 return;
 }
 var date = new Date(); //get today's date/time
 date.setMinutes(date.getMinutes() + minutesToStart); //add minutes until start of raid to get start time

 var endTime = formatTime(date); //format into a friendly 12h date format for the UI

 //may not be required, format date for mysql/discord
 date = date.getUTCFullYear() + '-' +
 ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
 ('00' + date.getUTCDate()).slice(-2) + ' ' +
 ('00' + date.getUTCHours()).slice(-2) + ':' +
 ('00' + date.getUTCMinutes()).slice(-2) + ':' +
 ('00' + date.getUTCSeconds()).slice(-2);

 //location information of pokemon raid
 var detail = message.content.substring(message.content.indexOf(minutesToStart.toString()) + minutesToStart.toString().length + 1);
 detail = removeTags(detail).replace('\'', '\'\''); //sanitize html and format for insertion into sql
 if (detail == null || detail == '') {
 message.channel.send('Raid not processed: use format: !raidegg [tierNumber] [minutesUntilHatch] [location details]');
 return;
 }
 if (detail.length > 255) {
 detail = detail.substring(0,255);
 }
 var sql = 'INSERT INTO raids (tier, boss, channel, endTime, detail) VALUES (\'' + tier + '\', \'egg\', \'' + channelId + '\', \'' + date.toString() + '\', \'' + detail + '\');';
 //console.log(sql); //currently logging all sql to the console for testing purposes
 /* pausing database activity for now
 db.query(sql, function(err, result) {
 if (err) {
 console.log(err + '\n' + sql);

 } else {
 message.channel.send('Processed Unhatched Raid #' + result.insertId + ' as Tier ' + tier + ' (cracking: ' + endTime + ') at ' + detail + ' added by ' + message.member.displayName);
 }

 });

 message.channel.send('Unhatched Raid reported to ' + client.channels.get(CHANNEL_IDS['#gymraids-alerts']) + ' as Tier ' + tier + ' (cracking: ' + endTime + ') at ' + detail + ' added by ' + message.member.displayName);
 //send alert to #gymraids-alerts channel
 client.channels.get(CHANNEL_IDS['#gymraids-alerts']).send('- ***Tier ' + tier + ' egg*** reported in ' + client.channels.get(channelId) + ' cracking at ' + endTime + ' at ' + detail);
 return;
 }*/

module.exports = (data) => (message => raid(data, message));
