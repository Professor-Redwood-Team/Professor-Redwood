const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const client = require('./src/client');
const config = require('./config/secrets.js');
const SwitchRouter = require('./routes/switch');
const logger = require('./logger');

const { token } = config.discord;
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());


app.use('/switch', SwitchRouter);
client.login(token);


app.listen(PORT, () => {
	logger.info(`Listening on ${PORT}`);
});

process.on('unhandledRejection', function(reason, p) {
	logger.error(
		'Possibly Unhandled Rejection at: Promise ',
		p,
		' reason: ',
		reason
	);
});
