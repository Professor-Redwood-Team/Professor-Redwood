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
		addRole: () => {return true;},
		removeRole: () => {return true;},
		displayName: 'Unit Test User',
		roles: [
			{'name': 'tyranitar'},
			{'name': 'westsf'},
		]
	},
};

describe('Chat commands', () => {
	describe('breakpoint', () => {
		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!breakpoint golem'});
			let result = breakpointCommand(fakeDiscordData)(msg);

			assert.equal(result.slice(0,23), 'Sorry, incorrect format');
		});

		it('golem', () => {
			let msg = Object.assign(fakeMessage, {content: '!breakpoint golem rock_throw 15'});
			let result = breakpointCommand(fakeDiscordData)(msg);

			//revisit after counter.js reformat
			assert(result.indexOf('damage against Ho-oh') > -1);
			//assert.ok(result.indexOf('**Future Sight Counters**') > -1);
		});
	});
	describe('checkNew', () => {
		const newUserMessage = {
			channel: {
				send: () => {},
			},
			member: {
				addRole: () => {return true;},
				removeRole: () => {return true;},
				displayName: 'Unit Test User',
				roles: []
			},
		};

		it('first message', () => {
			let msg = Object.assign(newUserMessage, {content: 'hi'});
			let result = checkNew(fakeDiscordData)(msg);

			assert.equal(result, 'Welcome Unit Test User - I\'ve given you access to all neighborhood channels. Read more' +
				' about the discord at #start_here. To filter out unwanted regions and neighborhood channels, ' +
				'go to undefined and use the **!play** command or type **!help**');
		});

		it('subsequent message', () => {
			let msg = Object.assign(fakeMessage, {content: 'I play pokemon go!'});
			let result = checkNew(fakeDiscordData)(msg);

			assert.equal(result, '');
		});
	});

	describe('!counters', () => {
		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!counters failure'});
			let result = countersCommand(fakeDiscordData)(msg);

			assert.equal(result, 'Sorry, counters for Failure aren\'t available at this time');
		});

		it('lugia', () => {
			let msg = Object.assign(fakeMessage, {content: '!counters lugia'});
			let result = countersCommand(fakeDiscordData)(msg);

			//revisit after counter.js reformat
			assert.equal(result.slice(0,45), '**Lugia** :lugia: HP **12500** | CP **42753**');
			assert.ok(result.indexOf('**Future Sight Counters**') > -1);
		});

		it('tyranitar', () => {
			let msg = Object.assign(fakeMessage, {content: '!counter tyranitar'});
			let result = countersCommand(fakeDiscordData)(msg);

			assert.equal(result.slice(0,38), 'Counters for **Tyranitar** :tyranitar:');
			assert.ok(result.indexOf('Poliwrath') > -1);
		});
	});

	describe('!cp', () => {
		it('lugia', () => {
			let msg = Object.assign(fakeMessage, {content: '!cp lugia'});
			let result = raidCpCommand(fakeDiscordData)(msg);

			assert.equal(result, '**Lugia** :lugia: Raid CP @ Lv20: [min: **1969**, max: **2056**]');
		});

		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!cp failure'});
			let result = raidCpCommand(fakeDiscordData)(msg);

			assert.equal(result, 'Sorry, CP for Failure isn\'t available at this time');
		});
	});

	describe('!help', () => {
		it('help', () => {
			let msg = Object.assign(fakeMessage, {content: '!help'});
			let result = helpCommand(fakeDiscordData)(msg);

			assert(result.indexOf('To gain access') > -1);
		});
	});

	describe.skip('!raid', () => {
		it('raid', () => {
			let msg = Object.assign(fakeMessage, {content: '!raid lugia 105 caltrain station'});
			let result = raidCommand(fakeDiscordData)(msg);

			assert(result.indexOf('put something here') > -1);
		});
	});

	describe('!reset', () => {
		it('reset', () => {
			let msg = Object.assign(fakeMessage, {content: '!reset'});
			let result = resetCommand(fakeDiscordData)(msg);

			assert.equal(result, fakeMessage.member.displayName + ' I am removing the following roles: tyranitar westsf');
		});

		it('reset VIP', () => {
			let resetVIPMessageData = Object.assign(fakeMessage);
			resetVIPMessageData.member.roles.push({'name': 'VIP'});
			resetVIPMessageData.member.roles.push({'name': 'badrole'});
			let msg = Object.assign(fakeMessage, {content: '!reset'});
			let result = resetCommand(fakeDiscordData)(msg);

			assert.equal(result, fakeMessage.member.displayName + ' I am removing the following roles: tyranitar westsf badrole');
		});
	});

	describe('!team', () => {
		it('valor', () => {
			let msg = Object.assign(fakeMessage, {content: '!team valor'});
			let result = teamCommand(fakeDiscordData)(msg);

			assert.equal(result, 'Welcome ' + fakeMessage.member.displayName + '! You now have access to valor\'s private chat');
		});

		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!team failure'});
			let result = teamCommand(fakeDiscordData)(msg);

			assert.equal(result, fakeMessage.member.displayName + ', please pick a correct team and type !team valor|mystic|instinct');
		});
	});

	describe('!want', () => {
		it('unown', () => {
			let msg = Object.assign(fakeMessage, {content: '!want unown'});
			let result = wantCommand(fakeDiscordData)(msg);

			assert.equal(result, 'OK Unit Test User! I will let you know when someone spots a unown in the wild or as a raid boss');
		});
		it('unknown / misspelling', () => {
			let msg = Object.assign(fakeMessage, {content: '!want unknown'});
			let result = wantCommand(fakeDiscordData)(msg);

			assert.equal(result, 'OK Unit Test User! I will let you know when someone spots a unown in the wild or as a raid boss');
		});
		it('tyranitar', () => {
			let msg = Object.assign(fakeMessage, {content: '!want tyranitar'});
			let result = wantCommand(fakeDiscordData)(msg);

			assert.equal(result, 'Oh? I will ignore tyranitar for you, Unit Test User');
		});
		it('failure', () => {
			let msg = Object.assign(fakeMessage, {content: '!want failure'});
			let result = wantCommand(fakeDiscordData)(msg);

			assert.equal(result.slice(0, 173), 'I\'m sorry, I can\'t find failure. Remember you can only type one pokemon\'s' +
				' name at a time. Type **!want pokemonName** where pokemonName is one item in any of the lists below:');
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
				'enter **!play sf|eastsf|centralsf|westsf|southsf|peninsula|sanjose|marin|eastbay|sacramento|allregions**');
		});
	});

});
