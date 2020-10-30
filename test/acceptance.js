'use strict';

/* eslint-disable */

const assert = require('assert');

const client = require('../src/client');

describe('Acceptance Chat Commands', () => {
	var client;
	var fakeMessage;
	var fakeNeighborhoodMessage;

	beforeEach((done) => {
		client = require('../src/client');

		client.guilds = [{
			emojis: {
				cache: [
					{name: 'tyranitar', id: 248},
					{name: 'lugia', id: 249}
				]
			},
			roles: { 
				cache: [ {name: 'westsf', id: 1} ]
			},
			channels: {
				cache: [ {name: 'gymraids_alerts', id: 12345},],
			}
		}];

		fakeMessage = {
			channel: {
				send: () => {},
				permissionOverwrites: [],
				name: 'professor_redwood',
			},
			member: {
				displayName: 'Unit Test User',
				roles: {
					cache:	[
						{'name': 'tyranitar'},
						{'name': 'westsf'},
					],
					add: () => {return true;},
					remove: () => {return true;},
				}
			},
		};

		fakeNeighborhoodMessage = {
			delete: () => {return true;},
			channel: {
				send: () => {},
				permissionOverwrites: [
					//{type: 'role', name: 'eastsf', id: 1}
				],
				name: 'test-channel',
				overwritePermissions:() => {return true;} 
			},
			member: {
				displayName: 'Unit Test User',
				roles: {
					cache:	[
						{'name': 'tyranitar'},
						{'name': 'westsf'},
					],
					add: () => {return true;},
					remove: () => {return true;},
				}
			},
		};

		client.emit('ready', done);
	});

	const sendMessage = (msg, cb) => {
		client.emit('message', msg, cb);
	};

	//wrong channel commands - check new

	describe('!breakpoint', () => {
		it('golem', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!breakpoint golem rock_throw 15'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('ROCK THROW damage against Ho-oh\nLv20:   8') > -1);
				done();
			});
		});
		it('alakazam', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam future_sight 15'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('FUTURE SIGHT damage against Venusaur\nLv20:   103') > -1);
				assert(result.match(/damage against/g).length >= 3);
				done();
			});
		});
		it('defender', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam future_sight 15 golduck'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('FUTURE SIGHT damage against Golduck\nLv20:   88') > -1);
				done();
			});
		});

		it('gen 3', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp golem rock_throw 15 regice'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('ROCK THROW damage against Regice\nLv20:   5') > -1);
				done();
			});
		});
		it('bad defender', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam future_sight 15 fail'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('Sorry, I can\'t find that defender. Remember to enter the pokemon\'s exact name in' +
						' the pokedex.\nCommand usage: **!breakpoint attacker attack_name iv (optional: defender)**') > -1);
				done();
			});
		});
		it('bad iv', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam future_sight 16'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('Sorry, IV must be 0-15.\nCommand usage: **!breakpoint attacker attack_name iv (optional: defender)**') > -1);
				done();
			});
		});
		it('additional spaces', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam  future_sight 15'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('FUTURE SIGHT damage against Venusaur\nLv20:   103') > -1);
				assert(result.match(/damage against/g).length >= 3);
				done();
			});
		});
		it('bad iv letters', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam future_sight zzzzz'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('Sorry, IV must be 0-15.\nCommand usage: **!breakpoint attacker attack_name iv (optional: defender)**') > -1);
				done();
			});
		});
		it('bad move', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp alakazam futuresight 2'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('Sorry, I can\'t find that move. Remember to replace spaces with _ when typing a move.\n' +
						'Command usage: **!breakpoint attacker attack_name iv (optional: defender)**') > -1);
				done();
			});
		});
		it('bad attacker', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!bp fail future_sight 0'});
			sendMessage(msg, (result) => {
				assert(result.indexOf('Sorry, I can\'t find that pokemon. Remember to enter the pokemon\'s exact name in' +
						' the pokedex.\nCommand usage: **!breakpoint attacker attack_name iv (optional: defender)**') > -1);
				done();
			});
		});
	});

	describe('!counters', () => {
		it('lugia', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!counter lugia'});
			sendMessage(msg, (result) => {
				assert.equal(result.slice(0,64), '**Lugia** <:lugia:249> HP **12500** | CP **42753** | Atk **193**');
				assert.ok(result.indexOf('**Future Sight Counters**') > -1);
				assert.ok(result.indexOf('__Cloyster__: Frost Breath') > -1);
				done();
			});
		});
		it('tyranitar', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!counters tyranitar'});
			sendMessage(msg, (result) => {
				assert.equal(result.slice(0,43), 'Counters for **Tyranitar** <:tyranitar:248>');
				assert.ok(result.indexOf('Poliwrath') > -1);
				done();
			});
		});
		it('raikou', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!counters raikou'});
			sendMessage(msg, (result) => {
				assert.ok(result.indexOf('Dragon Breath') > -1);
				done();
			});
		});
		it('uppercase', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!Counters Raikou'});
			sendMessage(msg, (result) => {
				assert.ok(result.indexOf('Dragon Breath') > -1);
				done();
			});
		});
		it('bad pokemon', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!counter failure'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Sorry, counters for Failure aren\'t available at this time');
				done();
			});
		});
		it.skip('no content', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!counter'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Usage: !counter pokemonName');
				done();
			});
		});
	});

	describe('!cp', () => {
		it('lugia', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!cp lugia'});
			sendMessage(msg, (result) => {
				assert.equal(result, '**Lugia** <:lugia:249> Raid CP @ Lv20: [min: **1969**, max: **2056**]');
				done();
			});
		});
		it('fail', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!cp fail'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Sorry, CP for Fail isn\'t available at this time');
				done();
			});
		});
		it.skip('no content', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!cp'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Usage: !cp raidBossPokemon');
				done();
			});
		});
	});

	describe('!egg', () => {
		it('normal', (done) => {
			let msg = Object.assign(fakeNeighborhoodMessage, {content: '!egg 4 110 caltrain station'});
			sendMessage(msg, (result) => {
				console.log(result); // remove when test works
				done();
			});
		});
	});

	describe('!help', () => {
		it('normal', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!help'});
			sendMessage(msg, (result) => {
				assert.equal(result.slice(0, 35), '**!team mystic | valor | instinct**');
				done();
			});
		});
	});

	describe('!hide', () => {
		it('normal', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!hide bayview-'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Hiding channel bayview- for user: Unit Test User');
				done();
			});
		});
	});

	describe('!play', () => {

	});

	describe('!raid', () => {

	});

	describe('!reset', () => {

	});

	describe('!team', () => {
		it('valor', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!team vAlor'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Welcome Unit Test User! You now have access to valor\'s private chat');
				done();
			});
		});
		it('instinct', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!team instinct'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Welcome Unit Test User! You now have access to instinct\'s private chat');
				done();
			});
		});
		it('already on team', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!team instinct'});
			msg.member.roles.cache.push({'name': 'mystic'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Unit Test User, you already have a team assigned. Run **!reset** to reset all of your roles on this discord.');
				done();
			});
		});
		it('fail', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!team fail'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Unit Test User, please pick a correct team and type !team valor|mystic|instinct');
				done();
			});
		});
		it('no content', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!team'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Unit Test User, please pick a correct team and type !team valor|mystic|instinct');
				done();
			});
		});
	});

	describe('!want', () => {
		it('unown', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!want unown'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'OK Unit Test User! I will let you know when someone spots a unown in the wild or as a raid boss');
				done();
			});
		});
		it('unknown', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!want unknown'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'OK Unit Test User! I will let you know when someone spots a unown in the wild or as a raid boss');
				done();
			});
		});
		it('tyranitar', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!want tyranitar'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Oh? I will ignore tyranitar for you, Unit Test User');
				done();
			});
		});
		it('failure', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!want failure'});
			sendMessage(msg, (result) => {
				assert.equal(result.slice(0, 173), 'I\'m sorry, I can\'t find failure. Remember you can only type one pokemon\'s' +
					' name at a time. Type **!want pokemonName** where pokemonName is one item in any of the lists below:');
				done();
			});
		});
		it.skip('no input', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!want'});
			sendMessage(msg, (result) => {
				assert.equal(result, 'Usage: !want pokemonName');
				done();
			});
		});
	});
});
