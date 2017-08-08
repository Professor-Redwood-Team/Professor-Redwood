'use strict';

const breakpoint = require('./chatcommands/breakpoint');
const checkNew = require('./chatcommands/checkNew');
const counters = require('./chatcommands/counters');
const cp = require('./chatcommands/raidcp');
const help = require('./chatcommands/help');
const play = require('./chatcommands/play');
const raid = require('./chatcommands/raid');
const team = require('./chatcommands/team');
const want = require('./chatcommands/want');

module.exports = (data) => {
	return {
        breakpoint: breakpoint(data),
		checkNew: checkNew(data),
		counters: counters(data),
		cp: cp(data),
		help: help(data),
		play: play(data),
		raid: raid(data),
		team: team(data),
		want: want(data),
	};
};
