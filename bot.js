'use strict';

// const mySQL = require('mysql');

const client = require('./src/client');
const config = require('./config/secrets.json');

const token = config.discord.token;
/* const db = mySQL.createConnection(config.mysql);
// let's not connect to the database for now
db.connect((err) => {
	if (err) throw err;
	console.log('Database Connected!');
}); */

client.login(token);
