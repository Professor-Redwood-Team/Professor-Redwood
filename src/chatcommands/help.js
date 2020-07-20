'use strict';

const CONSTANTS = require('./../constants');


const handleHelp = (data, message) => {
	let reply = '';

	reply = '**!team mystic | valor | instinct**\n*(you may only be on one team)*\n Sets your team. Grants you access to team chat and allows you to chat in most channels\n\n';

	reply += '**!play ' + CONSTANTS.REGIONS.join(' | ') + '** \n*(one region at a time, run again for more regions)*\n';
	reply += 'Sets your play region. To see what neighborhoods are in each region, see ' + data.channelsByName['start_here'] + '\n\n';

	reply += '**!hide #channel**\n*(specify the channel using # at the beginning)*\n';
	reply += 'Removes the channel you specify from your channel list' + '\n\n';

	reply += '**!want pokemonName**\n*(type **!want** for a list of available pokemon)*\nStarts OR stops alerts you receive for specified pokemon\n\n';

	reply += '**!reset**\n*(reverses !team, !want, !play, !hide commands)*\n';
	reply += 'Resets your profile on Discord. Removes all your roles: including team, play regions, Pokemon alerts, and channel hiding' + '\n\n';

	reply += '**!raid boss minutesLeft [exgym] location**\n*(run only in neighborhood channels)*\n';
	reply += 'Reports a raid which is forwarded to ' + data.channelsByName['gymraids_alerts'] + ' and the regional gymraids_ channel' + '\n\n';

	reply += '**!egg tier# minutesLeft [exgym] location**\n*(run only in neighborhood channels)*\n';
	reply += 'Reports a raid egg which is forwarded to ' + data.channelsByName['gymraids_alerts'] + ' and the regional gymraids_ channel';

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleHelp(data, message);
});
