const client = require('../src/client');
const config = require('../config/secrets.js');
const logger = require('../logger');
const token = config.discord.token;

function Off (req, res) {
    logger.info({ event: 'Turning bot off' });
    try {
        client.destroy()
            .then(() => res.status(200).send({ success: 'Bot is offline' }))
            .catch(e => res.status(422).send({ error: e }))
    } catch (err) {
        logger.error({
					event: `Error turning bot off: ${err.message} `
				});
    }
}

function On (req, res) {
    logger.info({ event: "Turning bot on" });
    try {
        client.login(token)
            .then(() => res.status(200).send({ success: 'Bot is online' }))
            .catch(e => res.status(422).send({ error: e }))
    } catch (err) {
        logger.error({
					event: `Error turning bot on: ${err.message} `
				});
    }
};

async function Restart (req, res) {
    logger.info({ event: "Restarting bot" });
    try {
        await client.destroy()
        await client.login(token)
    } catch (err) {
        logger.error({ event: `Error restarting bot: ${err.message}`});
        return res.status(422).send(e)
    }

    return res.status(200).send({ success: 'Bot restarted' })
}

module.exports = {
    Off,
    On,
    Restart
}
