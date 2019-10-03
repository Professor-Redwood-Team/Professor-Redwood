const CONSTANTS = require('./constants');

/**
 * Remove unnecessary strings in the details
 * @param {string} detail
 * @returns {string}
 */
const cleanUpDetails = detail => {
	const stringsToRemove = new Set(['exgym ', 'ex gym ', 'shiny check ', 'shinycheck ', 'rarecandy ', 'candy ', 'silverpinap ', 'silver pinap', 'pinap ', 'technical ', 'technicalmachine ', 'technical machine ', 'finalevo ', 'highiv ']);
	stringsToRemove.forEach(string => {
		const regex = new RegExp(string, 'gi');
		detail = detail.replace(regex, '');
	});
	if (detail.length > 255) detail = detail.substring(0,255);
	return detail;
};

/**
 * Format a date object as a string in 12 hour format
 * @param {object} dateObj
 * @returns {string}
 */
const formatTime = dateObj => {
	let hour = dateObj.getHours();
	let minute = dateObj.getMinutes();
	const amPM = hour > 11 ? 'pm' : 'am';
	if (hour > 12) {
		hour -= 12;
	} else if (hour === 0) {
		hour = '12';
	}
	if (minute < 10) minute = `0${minute}`;
	return `${hour}:${minute}${amPM}`;
};

/**
 * Returns end time of egg/raid
 * @param {number} minutesLeft
 * @returns {string}
 */
const getEndTime = minutesLeft => {
	const date = new Date();
	date.setMinutes(date.getMinutes() + minutesLeft);
	return formatTime(date);
};

/**
 * Checks if legendary and returns @legendary tag
 * @param {string} boss
 * @param {array} legendaries
 * @param {object} data
 * @returns {string}
 */
const getLegendaryTag = (boss, legendaries, data) => {
	if (legendaries.includes(boss)) {
		if (data.rolesByName['legendary']) {
			return '<@&' + data.rolesByName['legendary'].id + '> ';
		} else {
			console.warn('Please create a role called legendary.');
		}
	}
	return '';
};

/**
 * If the Pokemon name is found as a role, put in mention format
 * @param {string} pokemonName
 * @param {object} data
 * @returns {string}
 */
const getPokemonTag = (pokemonName, data) => {
	let pokemonTag = pokemonName;
	data.GUILD.roles.forEach(role => {
		if (role.name === pokemonName) pokemonTag = '<@&' + role.id + '>';
	});
	return pokemonTag;
};

/**
 * Checks what reward was reported and returns reward and reward tag
 * @param {string} msgLower
 * @param {object} data
 * @returns {string}
 */
const getRewardAndRewardTag = (reward, msgLower, data) => {
	const technicalMachineVariations = new Set(['chargetm', 'chargedtm', 'charged_tm', 'fast_tm', 'fasttm', 'tm', 'charge', 'charged', 'fast']);
	const rareCandyVariations = new Set(['rc', 'rarecand', 'rarecandy', 'rare_candy', 'rare', 'cand', 'candy']);
	const stardustVariations = new Set(['stardust', 'dust']);
	const silverPinapVariations = new Set(['silverpinap', 'silver']);

	if (rareCandyVariations.has(reward)) {
		reward = 'rarecandy';
	} else if (technicalMachineVariations.has(reward)) {
		reward = 'technical_machine';
	} else if (stardustVariations.has(reward)) {
		reward = 'stardust';
	} else if (silverPinapVariations.has(reward)) {
		reward = 'silver_pinap';
	}

	let rewardTag = reward;

	// If the reward name is found as a role, put in mention format
	data.GUILD.roles.forEach(role => {
		if (role.name === reward) rewardTag = '<@&' + role.id + '>';
	});

	// Check to see if the message contains a mention of 'shiny'
	data.GUILD.roles.forEach(role => {
		if (msgLower.includes('shiny') && role.name === 'shinycheck') rewardTag += ' <@&' + role.id + '> ' + data.getEmoji('shiny');
	});

	return { reward, rewardTag };
};

/**
 * If the Pokemon exists, return shadow mention tag
 * @param {string} pokemonName
 * @param {string} message
 * @param {object} data
 * @returns {string}
 */
const getShadowTag = (pokemonName, message, data) => {
	let shadowTag = '';
	if (message.content.includes(pokemonName) && data.rolesByName['shadow']) {
		shadowTag = ' <@&' + data.rolesByName['shadow'].id + '> ';
	}
	return shadowTag;
};

/**
 * Checks if exgym and returns @exgym tag
 * @param {string} msgLower
 * @param {object} data
 * @returns {string}
 */
const getSpecialRaidTag = (msglower, data) => {
	if (msglower.includes('exgym') || msglower.includes(' ex gym') || msglower.includes('ex raid') || msglower.includes('(ex gym)')) {
		if (data.rolesByName['exgym']) {
			return '<@&' + data.rolesByName['exgym'].id + '> ';
		} else {
			console.warn('Please create a role called exgym.');
		}
	}
	return '';
};

/**
 * Checks if message has special wild tag and returns appropriate mention tag
 * @param {string} msgLower
 * @param {object} data
 * @returns {string}
 */
const getSpecialWildTag = (msgLower, data) => {
	let specialWildTag = '';

	// Tags role called highiv whenever 'highiv' is in a report
	if (msgLower.includes('highiv')) {
		data.GUILD.roles.forEach(role => {
			if (role.name === 'highiv') specialWildTag += ' <@&' + role.id + '> '; // require a role called 'highiv'
		});
	}
	// Tags role called shinycheck whenever 'shiny' is in a report
	if (msgLower.includes('shiny')) {
		data.GUILD.roles.forEach(role => {
			if (role.name === 'shinycheck') specialWildTag += ' <@&' + role.id + '> ' + data.getEmoji('shiny'); // require a role called 'shinycheck'
		});
	}
	// Tags role called shinycheck whenever 'finalevo' is in a report
	if (msgLower.includes('finalevo')) {
		data.GUILD.roles.forEach(role => {
			if (role.name === 'finalevo') specialWildTag += ' <@&' + role.id + '> '; // require a role called 'finalevo'
		});
	}

	return specialWildTag;
};

/**
 * Checks raid type and tier then returns tier emoji and egg tag
 * @param {number} tier
 * @param {object} data
 * @returns {object}
 */
const getTierEmojiAndEggTag = (tier, data) => {
	let tierEmoji = '';
	let eggTag = 'Tier ' + tier;
	if (tier == 5) {
		tierEmoji = 'legendaryraid';
		eggTag = ' <@&' + data.rolesByName['tier5'].id + '> ';
	} else if (tier < 3) {
		tierEmoji = 'normalraid';
		if(tier == 1) eggTag = ' <@&' + data.rolesByName['tier1'].id + '> ';
		if(tier == 2) eggTag = ' <@&' + data.rolesByName['tier2'].id + '> ';    
	} else if (tier > 2) {
		tierEmoji = 'rareraid';
		if(tier == 3) eggTag = ' <@&' + data.rolesByName['tier3'].id + '> ';
		if(tier == 4) eggTag = ' <@&' + data.rolesByName['tier4'].id + '> ';
	}
	return { tierEmoji, eggTag };
};

/**
 * Removes tags for html
 * @param {string} html
 * @returns {string}
 */
const removeTags = html => {
	let oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

/**
 * Sends alert to channel if it exists
 * @param {string} channelName
 * @param {string} reply
 * @param {object} data
 */
const sendAlertToChannel = (channelName, reply, data) => {
	if (data.channelsByName[channelName]) {
		data.channelsByName[channelName].send(reply);
	} else {
		console.warn(`Please add a channel called #${channelName}.`);
	}
};

module.exports = {
	cleanUpDetails,
	formatTime,
	getEndTime,
	getLegendaryTag,
	getPokemonTag,
	getRewardAndRewardTag,
	getShadowTag,
	getSpecialRaidTag,
	getSpecialWildTag,
	getTierEmojiAndEggTag,
	removeTags,
	sendAlertToChannel
};
