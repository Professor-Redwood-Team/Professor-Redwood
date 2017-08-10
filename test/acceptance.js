'use strict';

/* eslint-disable */

const assert = require('assert');

const client = require('../src/client');

const fakeMessage = {
	channel: {
		send: () => {},
		permissionOverwrites: [],
		name: 'professor_redwood',
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

describe.only('Acceptance Chat Commands', () => {
	var client;

	beforeEach((done) => {
		client = require('../src/client');

		client.guilds = [{
			emojis: [{name: 'lugia', id: 249}],
			roles: [],
		}];

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

	});

	describe('!cp', () => {
		it('lugia', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!cp lugia'});
			sendMessage(msg, (result) => {
				assert.equal(result, '**Lugia** <:lugia:249> Raid CP @ Lv20: [min: **1969**, max: **2056**]');
				done();
			});
		});
	});

	describe('!help', () => {

	});

	describe('!play', () => {

	});

	describe('!raid', () => {

	});

	describe('!reset', () => {

	});

	describe('!team', () => {

	});

	describe('!want', () => {

	});
});