'use strict';

// const mySQL = require('mysql');

const client = require('./src/client');
const config = require('./config/secrets.json');
const mongoose = require('mongoose')

const token = config.discord.token;
/* const db = mySQL.createConnection(config.mysql);
// let's not connect to the database for now
db.connect((err) => {
	if (err) throw err;
	console.log('Database Connected!');
}); */

if (config.DATABASE_URL !== null) {
	mongoose.Promise = bluebird
	mongoose.connect(config.DATABASE_URL, { useMongoClient: true });
	mongoose.connection
		.once('open', () => console.log('Database Connected!'))
		.on('error', error => console.log(`Database connection error: ${error}`));
}


client.login(token);
