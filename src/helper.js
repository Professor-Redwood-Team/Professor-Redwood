/**
 * Remove unnecessary strings in the details
 * @param {string} detail
 * @returns {string}
 */
const cleanUpDetails = detail => {
  const stringsToRemove = new Set(['exgym', 'shinycheck', 'rare', 'candy', 'silver', 'pinap', 'techincal', 'machine']);
  detail = detail.split(' ').filter(word => !stringsToRemove.has(word)).join(' ');
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
 * Checks what reward was reported and returns reward and reward tag
 * @param {string} msgLower
 * @param {object} data
 * @returns {string}
 */
const getRewardAndRewardTag = (reward, msgLower, data) => {
  const technicalMachineVariations = new Set(['chargetm', 'chargedtm', 'charged_tm', 'fast_tm', 'fasttm', 'tm', 'charge', 'charged', 'fast']);
  const rareCandyVariations = new Set(['rc', '1rc', '3rc', 'rarecand', 'rarecandy', 'rare_candy', 'rare', 'cand', 'candy']);
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
 * Checks if exgym and returns @exgym tag
 * @param {string} msgLower
 * @param {object} data
 * @returns {string}
 */
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
 * Sends alert to channel
 * @param {string} channelName
 * @param {string} reply
 * @param {object} data
 */
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
  getRewardAndRewardTag,
  getSpecialRaidTag,
  getTierEmojiAndEggTag,
  removeTags,
  sendAlertToChannel
};
