const { createLogger } = require('bunyan');
const logger = createLogger({
	name: 'Redwood',
	stream: process.stdout,
	level: 'info',
});

module.exports = logger;