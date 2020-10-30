'use strict';

const CONSTANTS = require('./../constants');


const handleHelp = (data, message) => {
	let reply = '';

	reply = '**!team mystic | valor | instinct**\n*(you may only be on one team)*\n Sets your team. Grants you access to team chat and allows you to chat in most channels\n\n';

	reply += '**!play ' + CONSTANTS.REGIONS.join(' | ') + '** \n*(one region at a time, run again for more regions)*\n';
	reply += 'Sets OR removes a play region. To see what neighborhoods are in each region, see ' + data.channelsByName['town_map'] + '\n\n';

	reply += '**!hide #channel**\n*(specify the channel using # at the beginning)*\n';
	reply += 'Removes the channel you specify from your channel list' + '\n\n';

	reply += '**!want keyword**\n*(type **!want** for a list of available alerts to which you can subscribe)*\nStarts OR stops alerts you receive for specified Pokémon or reward items\n\n';

	reply += '**!reset**\n*(reverses !team, !want, !play, !hide commands)*\n';
	reply += 'Resets your profile on Discord. Removes all your roles: including team, play regions, Pokémon alerts, and channel hiding' + '\n\n';

	reply += '** For other commands, please see **' + data.channelsByName['bot_commands'];

	message.channel.send(reply);
	return reply;
};

module.exports = (data) => ( (message) => {
	return handleHelp(data, message);
});
