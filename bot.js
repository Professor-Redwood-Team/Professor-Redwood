'use strict';

const client = require('./src/client');
const config = require('./config/secrets');

client.login(config.discord.token);
