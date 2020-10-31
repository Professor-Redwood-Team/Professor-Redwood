const CONSTANTS = require('./constants');

/**
 * Remove unnecessary strings in the details
 * @param {string} detail
 * @returns {string}
 */
const cleanUpDetails = detail => {
  const exGymVariations = ['(exgym)', '(ex gym)', 'exgym', 'ex gym', 'exraid', 'ex raid'];
  const highIvVariations = ['highiv','high iv'];
  const shinyCheckVariations = ['shiny check', 'shinycheck', 'shiny'];
	const rareCandyVariations = ['rarecandy', 'rare candy'];
	const silverPinapVariations = ['silverpinap', 'silver pinap','silverpinaps', 'pinaps', 'pinap'];
	const unovaStonesVariations = ['unova stone', 'unova stones', 'unova_stone', 'unovastone'];
	const technicalMachineVariations = ['technical', 'technicalmachine', 'technical machine'];
	const lureVariations = ['magnetic', 'mossy', 'lure', 'glacial'];
	const stringsToRemove = [
		...exGymVariations,
		...highIvVariations,
		...shinyCheckVariations,
		...rareCandyVariations,
		...silverPinapVariations,
		...unovaStonesVariations,
		...technicalMachineVariations,
		...lureVariations,
		'finalevo',
	];

	stringsToRemove.forEach(string => {
		const regex = new RegExp(string, 'gi');
		detail = detail.replace(regex, '');
	});

	// Replace multiple spaces with a single space
	detail = removeExtraSpaces(detail);

	if (detail.length > 255) detail = detail.substring(0,255);
	return detail.trim();
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
			return '<@&' + data.rolesByName['legendary'].id + '>';
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
	data.GUILD.roles.cache.forEach(role => {
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
	const rareCandyVariations = new Set(['rc', 'rarecand', 'rarecandy', 'rare_candy', 'rare']);
	const stardustVariations = new Set(['stardust', 'dust']);
	const silverPinapVariations = new Set(['silverpinap', 'silverpinaps', 'silver']);
	const sinnohStonesVariations = new Set(['sinnoh', 'sinnohstone', 'sinnohstones']);
	const unovaStonesVariations = new Set(['unova', 'unovastone', 'unovastones']);
	const magneticLureVariations = new Set(['magnetic']);
	const glacialLureVariations = new Set(['glacial']);
	const mossyLureVariations = new Set(['mossy']);

	if (rareCandyVariations.has(reward)) {
		reward = 'rarecandy';
	} else if (technicalMachineVariations.has(reward)) {
		reward = 'technical_machine';
	} else if (stardustVariations.has(reward)) {
		reward = 'stardust';
	} else if (silverPinapVariations.has(reward)) {
		reward = 'silver_pinap';
	} else if (sinnohStonesVariations.has(reward)) {
		reward = 'sinnoh_stone';
	} else if (unovaStonesVariations.has(reward)) {
		reward = 'unova_stone';
	} else if (magneticLureVariations.has(reward)) {
		reward = 'magnetic_lure';
	} else if (glacialLureVariations.has(reward)) {
		reward = 'glacial_lure';
	} else if (mossyLureVariations.has(reward)) {
		reward = 'mossy_lure';
	}

	let rewardTag = reward;

	// If the reward name is found as a role, put in mention format
	data.GUILD.roles.cache.forEach(role => {
		if (role.name === reward) rewardTag = '<@&' + role.id + '>';
	});

	// Check to see if the message contains a mention of 'shiny'
	data.GUILD.roles.cache.forEach(role => {
		if (msgLower.includes('shiny') && role.name === 'shinycheck') rewardTag += ' <@&' + role.id + '> ' + data.getEmoji('shiny');
	});

	return { reward, rewardTag };
};

/**
 * If TR Leader Arlo,Cliff,Sierra exists, return shinycheck tag
 * @param {string} pokemonName
 * @param {string} message
 * @param {object} data
 * @returns {string}
 */
const getTrShinyTag = (pokemonName, message, data) => {
	let trShinyTag = '';
    if (pokemonName == 'arlo' || pokemonName == 'cliff' || pokemonName == 'sierra') {
        if (data.rolesByName['shinycheck']) {
            trShinyTag = ' <@&' + data.rolesByName['shinycheck'].id + '> ' + data.getEmoji('shiny');
		}};
	return trShinyTag;
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
	 if (message.content.includes(pokemonName) > -1) {
         if (data.rolesByName['shadow']) {
            shadowTag = ' <@&' + data.rolesByName['shadow'].id + '> ';
        } 
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
	if (msglower.includes('exgym') || msglower.includes(' ex gym') || msglower.includes('exraid') || msglower.includes('ex raid') || msglower.includes('(ex gym)')) {
		if (data.rolesByName['exgym']) {
			return '<@&' + data.rolesByName['exgym'].id + '>';
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
	if  (msgLower.includes('highiv') || msgLower.includes('high iv') || msgLower.includes('100 iv') || msgLower.includes('100%') || msgLower.includes('hundo') || msgLower.includes('100iv')) {
		data.GUILD.roles.cache.forEach(role => {
			if (role.name === 'highiv') specialWildTag += '<@&' + role.id + '> '; // require a role called 'highiv'
		});
	}
	// Tags role called finalevo whenever 'finalevo' is in a report
	if (msgLower.includes('finalevo')) {
		data.GUILD.roles.cache.forEach(role => {
			if (role.name === 'finalevo') specialWildTag += '<@&' + role.id + '> '; // require a role called 'finalevo'
		});
	}
	// Tags role called shinycheck whenever 'shiny' is in a report
	if (msgLower.includes('shiny')) {
		data.GUILD.roles.cache.forEach(role => {
			if (role.name === 'shinycheck') specialWildTag += '<@&' + role.id + '> ' + data.getEmoji('shiny'); // require a role called 'shinycheck'
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
		if(tier == 2) eggTag = ' <@&' + data.rolesByName['tier2'].id + '> ';    // this tier no longer supported but keeping code in in case Niantic changes their mind
	} else if (tier > 2) {
		tierEmoji = 'rareraid';
		if(tier == 3) eggTag = ' <@&' + data.rolesByName['tier3'].id + '> ';
		if(tier == 4) eggTag = ' <@&' + data.rolesByName['tier4'].id + '> ';   // this tier no longer supported but keeping code in in case Niantic changes their mind
	}	else if (tier = 'mega') {
		tierEmoji = 'megaraid';
		eggTag = ' <@&' + data.rolesByName['mega'].id + '> ';
	}
  return {
    tierEmoji: tierEmoji.trim(),
    eggTag: eggTag.trim()
  };
};

/**
 * Removes extra spaces between words
 * @param {string} detail
 * @returns {string}
 */
const removeExtraSpaces = detail => detail.replace(/  +/g, ' ');

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
	getTrShinyTag,
	getShadowTag,
	getSpecialRaidTag,
	getSpecialWildTag,
	getTierEmojiAndEggTag,
	removeExtraSpaces,
	removeTags,
	sendAlertToChannel
};
