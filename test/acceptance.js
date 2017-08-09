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

describe('Acceptance Chat Commands', () => {
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

	//wrong channel

	describe('!cp', () => {
		it('lugia', (done) => {
			let msg = Object.assign(fakeMessage, {content: '!cp lugia'});
			sendMessage(msg, (result) => {
				assert.equal(result, '**Lugia** <:lugia:249> Raid CP @ Lv20: [min: **1969**, max: **2056**]');
				done();
			});
		});
	});
});