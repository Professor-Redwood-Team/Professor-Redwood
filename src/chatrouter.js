'use strict';

const breakpoint = require('./chatcommands/breakpoint');
const checkNew = require('./chatcommands/checkNew');
const counters = require('./chatcommands/counters');
const cp = require('./chatcommands/raidcp');
const egg = require('./chatcommands/egg');
const help = require('./chatcommands/help');
const hide = require('./chatcommands/hide');
const mod = require('./chatcommands/mod');
const play = require('./chatcommands/play');
const quest = require('./chatcommands/quest');
const raid = require('./chatcommands/raid');
const reset = require('./chatcommands/reset');
const team = require('./chatcommands/team');
const want = require('./chatcommands/want');
const wild = require('./chatcommands/wild');
const lure = require('./chatcommands/lure');
const tr = require('./chatcommands/tr');

module.exports = (data) => {
	return {
		breakpoint: breakpoint(data),
		checkNew: checkNew(data),
		counters: counters(data),
		cp: cp(data),
		egg: egg(data),
		help: help(data),
		hide: hide(data),
		mod: mod(data),
		play: play(data),
		quest: quest(data),
		raid: raid(data),
		reset: reset(data),
		team: team(data),
		want: want(data),
		wild: wild(data),
		lure: lure(data),
		tr: tr(data),
	};
};