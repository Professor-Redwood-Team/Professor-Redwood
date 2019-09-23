// Clean up details string
const cleanUpDetails = (detail) => {
  // Removes exgym string from location details
  if (detail.includes('exgym')) detail = detail.split(' ').filter(word => word !== 'exgym').join(' ');
  // Trim details if length exceeds 255 characters
  if (detail.length > 255) detail = detail.substring(0,255);
  return detail;
};

// Format a date object as a string in 12 hour format
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

// Returns end time of egg/raid
const getEndTime = minutesLeft => {
  const date = new Date();
	date.setMinutes(date.getMinutes() + minutesLeft);
	return formatTime(date);
};

// Checks if legendary and return @legendary tag
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

// Checks if exgym and returns @exgym tag
const getSpecialRaidTag = (msglower, data) => {
	if (msglower.indexOf('exgym') > -1 || msglower.indexOf(' ex gym') > -1 || msglower.indexOf('ex raid') > -1 || msglower.indexOf('(ex gym)') > -1) {
		if (data.rolesByName['exgym']) {
			return '<@&' + data.rolesByName['exgym'].id + '> ';
		} else {
			console.warn('Please create a role called exgym.');
		}
  }
  return '';
};

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

const removeTags = html => {
	let oldHtml;
	do {
		oldHtml = html;
		html = html.replace(CONSTANTS.tagOrComment, '');
	} while (html !== oldHtml);
	return html.replace(/</g, '&lt;');
};

const sendAlertToChannel = (channelName, reply, data) => {
  if (data.channelsByName[channelName]) {
		data.channelsByName[channelName].send(reply);
	} else {
		console.warn(`Please add a channel called #${channelName}`);
  }
};

module.exports = {
  cleanUpDetails,
  formatTime,
  getEndTime,
  getLegendaryTag,
  getSpecialRaidTag,
  getTierEmojiAndEggTag,
  removeTags,
  sendAlertToChannel
};
