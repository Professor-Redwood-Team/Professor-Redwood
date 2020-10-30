'use strict';

/* eslint-disable */

const assert = require('assert');

const breakpointCommand = require('../src/chatcommands/breakpoint');
const checkNew = require('../src/chatcommands/checkNew');
const countersCommand = require('../src/chatcommands/counters');
const helpCommand = require('../src/chatcommands/help');
const playCommand = require('../src/chatcommands/play');
const raidCommand = require('../src/chatcommands/raid');
const raidCpCommand = require('../src/chatcommands/raidcp');
const resetCommand = require('../src/chatcommands/reset');
const teamCommand = require('../src/chatcommands/team');
const wantCommand = require('../src/chatcommands/want');

const fakeDiscordData = {
	getEmoji: (p) => {return ':' + p + ':';},
	format_time: (p) => {return p;},
	removeTags: (p) => {return p;},
	rolesByName: {
		valor: {},
		instinct: {},
		mystic: {},
	},
	channelsByName: {
		start_here: '#start_here',
		gymraids_alerts: {
			send: () => {return true;},
		},
	},
	GUILD: {
		roles: [
			{'name': 'lugia'},
			{'name': 'eastsf'}
		],
	},

};
const fakeMessage = {
	channel: {
		send: () => {},
		permissionOverwrites: [],
	},
	member: {
		displayName: 'Unit Test User',
		roles: {
			cache:	[
				{'name': 'tyranitar'},
				{'name': 'westsf'},
			],
			add: () => {return true;},
			remove: () => { 
				return { 
					catch: () => {return true;} 
				} 
			}
		},
	},
};

describe('UNIT TESTS PLEASE TRANSITION TO ACCEPTANCE', () => {
	describe('checkNew', () => {
		const newUserMessage = {
			channel: {
				send: () => {},
			},
			member: {
				displayName: 'Unit Test User',
				roles: {
					cache: [],
					add: () => {return true;},
					remove: () => {return true;},
				}
			},
		};

		it('first message', () => {
			let msg = Object.assign(newUserMessage, {content: 'hi'});
			let result = checkNew(fakeDiscordData)(msg);

			assert.equal(result, 'Welcome Unit Test User - Please read discord rules and learn bot commands in #start_here before doing anything. For now, I\'ve given you allregions. Run bot commands in undefined and type **!help** for more information.');
		});

		it('subsequent message', () => {
			let msg = Object.assign(fakeMessage, {content: 'I play pokemon go!'});
			let result = checkNew(fakeDiscordData)(msg);

			assert.equal(result, '');
		});
	});

	describe('!reset', () => {
		it('reset', () => {
			let msg = Object.assign(fakeMessage, {content: '!reset'});
			let result = resetCommand(fakeDiscordData)(msg);

			assert.equal(result, fakeMessage.member.displayName + ', I am removing the following roles: tyranitar westsf');
		});

		it('reset VIP', () => {
			let resetVIPMessageData = Object.assign(fakeMessage);
			resetVIPMessageData.member.roles.cache.push({'name': 'VIP'});
			resetVIPMessageData.member.roles.cache.push({'name': 'badrole'});
			let msg = Object.assign(fakeMessage, {content: '!reset'});
			let result = resetCommand(fakeDiscordData)(msg);

			assert.equal(result, fakeMessage.member.displayName + ', I am removing the following roles: tyranitar westsf badrole');
		});
	});

	describe('!play', () => {
		it('eastsf', () => {
			let msg = Object.assign(fakeMessage, {content: '!play eastsf'});
			let result = playCommand(fakeDiscordData)(msg);

			assert.equal(result, 'OK Unit Test User! I have you playing in the eastsf region');
		});
		it('westsf', () => {
			let msg = Object.assign(fakeMessage, {content: '!play westsf'});
			let result = playCommand(fakeDiscordData)(msg);

			assert.equal(result, 'Oh? You already had westsf, so I\'ll remove it for you Unit Test User');
		});
		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!play failure'});
			let result = playCommand(fakeDiscordData)(msg);

			assert.equal(result, 'I\'m sorry, I can\'t find failure. Remember you can only type one region at a time. Please ' +
				'enter **!play sf|eastsf|centralsf|westsf|southsf|peninsula|allregions**');
		});
	});

});
