/* @flow */
const CONSTANTS = require('./constants');

function teamProps(name, color) {
	return {
		name,
		color,
		hoist: true,
		permissions: ['READ_MESSAGES', 'SEND_MESSAGES'],
		mentionable: false,
	}
}
function regionProps(name) {
	return {
		name,
		hoist: false,
		permissions: ['READ_MESSAGES', 'SEND_MESSAGES'],
		mentionable: false,
	}
}
function monProps(name) {
	return {
		name,
		hoist: false,
		permissions: ['READ_MESSAGES', 'SEND_MESSAGES'],
		mentionable: true,
	}
}


function initRoles(rolesByName, guild) {
	const promises = [];
	if (!rolesByName.hasOwnProperty('instinct')) {
		promises.push(guild.createRole(teamProps('instinct', 'GOLD')));
	}
	if (!rolesByName.hasOwnProperty('mystic')) {
		promises.push(guild.createRole(teamProps('mystic', 'BLUE')));
	}
	if (!rolesByName.hasOwnProperty('valor')) {
		promises.push(guild.createRole(teamProps('valor', 'RED')));
	}
	for (const region of CONSTANTS.REGIONS) {
		if (!rolesByName.hasOwnProperty(region)) {
			promises.push(guild.createRole(regionProps(region)));
		}
	}
	for (const mon of [...CONSTANTS.SPECIALMONS, ...CONSTANTS.LEGENDARYMONS, ...CONSTANTS.RAIDMONS, ...CONSTANTS.MONS]) {
		if (!rolesByName.hasOwnProperty(mon)) {
			promises.push(guild.createRole(monProps(mon)));
		}
	}

	return Promise.all(promises).then((roles) => {
		for (const role of roles) {
			rolesByName[role.name] = role;
		}
	}).then(() => rolesByName);
}

function initChannels(channelsByName, rolesByName, guild) {
	const promises = [];

	// professor_redwood (a channel specifically for bot commands) - @everyone may Read & Send messages
	if (!channelsByName.hasOwnProperty('professor_redwood')) {
		promises.push(guild.createChannel('professor_redwood', 'text').then((channel) => {
			return channel.overwritePermissions(rolesByName['@everyone'], {READ_MESSAGES: true, SEND_MESSAGES: true}).then(() => channel);
		}));
	}

	// Team-specific private chat
	for (const team of CONSTANTS.TEAMS) {
		if (!channelsByName.hasOwnProperty(team)) {
			promises.push(guild.createChannel(team, 'text').then((channel) => {
				return Promise.all([
					channel.overwritePermissions(rolesByName.admin, {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName.mod, {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName[team], {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName['@everyone'], {READ_MESSAGES: false, SEND_MESSAGES: false}),
				]).then(() => channel);
			}));
		}
	}

	// gymraids_alerts (required for alert forwarding) - only admin/mod/3 teams should have Send Message privilege, @everyone should have no privilege
	if (!channelsByName.hasOwnProperty('gymraids_alerts')) {
		promises.push(guild.createChannel('gymraids_alerts', 'text').then((channel) => {
			return Promise.all([
				channel.overwritePermissions(rolesByName.admin, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName.mod, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName.instinct, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName.mystic, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName.valor, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName['@everyone'], {READ_MESSAGES: false, SEND_MESSAGES: false}),
			]).then(() => channel);
		}));
	}

	// start_here (required for instructing users on bot usage) - only admin/mod roles should have Send Message privilege, @everyone should have Read only
	if (!channelsByName.hasOwnProperty('start_here')) {
		promises.push(guild.createChannel('start_here', 'text').then((channel) => {
			return Promise.all([
				channel.overwritePermissions(rolesByName.admin, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName.mod, {READ_MESSAGES: true, SEND_MESSAGES: true}),
				channel.overwritePermissions(rolesByName['@everyone'], {READ_MESSAGES: true, SEND_MESSAGES: false}),
			]).then(() => channel);
		}));
	}

	for (const region of CONSTANTS.REGIONS) {
		// neighborhood channels! When creating these, make sure to use '-' in each name, even if it's at the beginning or end. Proper examples are pier39-marina and sanjose-
		// -- make sure to only allow allregions and the appropriate region role to access each channel
		// TODO: need to add neighborhood-to-region mapping to constants.js first.

		// regional gym channels, each region role you created should have a corresponding gym channel, called gymraids_ + the name of your region role
		const regionalRaidChannel = `gymraids_${region}`;
		if (region !== 'allregions' && !channelsByName.hasOwnProperty(regionalRaidChannel)) {
			promises.push(guild.createChannel(regionalRaidChannel, 'text').then((channel) => {
				return Promise.all([
					channel.overwritePermissions(rolesByName.admin, {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName.mod, {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName[region], {READ_MESSAGES: true, SEND_MESSAGES: true}),
					channel.overwritePermissions(rolesByName['@everyone'], {READ_MESSAGES: false, SEND_MESSAGES: false}),
				]).then(() => channel);
			}));
		}
	}

	return Promise.all(promises).then((channels) => {
		for (const channel of channels) {
			channelsByName[channel.name] = channel;
		}
	});
}

module.exports = {
	initChannels,
	initRoles,
}
