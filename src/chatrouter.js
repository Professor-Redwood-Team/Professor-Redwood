'use strict';

const attack = require('./chatcommands/attack');
const breakpoint = require('./chatcommands/breakpoint');
const checkNew = require('./chatcommands/checkNew');
const counters = require('./chatcommands/counters');
const cp = require('./chatcommands/raidcp');
const help = require('./chatcommands/help');
const hide = require('./chatcommands/hide');
const play = require('./chatcommands/play');
const raid = require('./chatcommands/raid');
const reset = require('./chatcommands/reset');
const team = require('./chatcommands/team');
const want = require('./chatcommands/want');

module.exports = (data) => {
	return {
		attack: attack(data),
		breakpoint: breakpoint(data),
		checkNew: checkNew(data),
		counters: counters(data),
		cp: cp(data),
		help: help(data),
		hide: hide(data),
		play: play(data),
		raid: raid(data),
		reset: reset(data),
		team: team(data),
		want: want(data),
	};
};
