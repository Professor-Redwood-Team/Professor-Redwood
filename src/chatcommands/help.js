/* @flow */
'use strict';

const CONSTANTS = require('./../constants');

import type {Message} from 'discord.js';
import type {CommandData} from '../types';

const handleHelp = (data: CommandData, message) => {
	let reply = '';

	reply = '**!team mystic | valor | instinct**\n*(you may only be on one team)*\nGrants you access to team chat and allows you to chat in most channels\n\n';

	reply += '**!play ' + CONSTANTS.REGIONS.join('|') + '** \n*(one region at a time, run again for more regions)*\n';
	reply += 'Hides neighborhood channels outside of your selected region(s) (see ' + data.channelsByName['start_here'] + '\n\n';

	reply += '**!want pokemonName**\n*(type **!want** for a list of available pokemon*\nStarts OR stops alerts you receive for specified pokemon\n\n';

	reply += '**!cp pokemonName** or **!counters pokemonName**\n*(available for tier 3-5 raid bosses*)\nDisplays the CP range at level 20 or the best counters for the specified pokemon\n\n';
	reply += '**!breakpoint pokemon attack_move attackIV defender**\n*(!bp may also be used)\n(defender is optional)*\nDisplays how high to power your pokemon to deal max damage to specific pokemon\n\n';

	reply += '**!raid boss minutesLeft location**\nReports a raid which is forwarded to ' + data.channelsByName['gymraids_alerts'] + ' and the regional gymraids_ channel';

	message.channel.send(reply);
	return reply;
};

module.exports = (data: CommandData) => ( (message: Message) => {
	return handleHelp(data, message);
});
