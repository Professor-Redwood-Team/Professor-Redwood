const client = require('../src/client')
const config = require('../config/secrets.json')
const token = config.discord.token

function Off (req, res) {
    client.destroy()
        .then(() => res.status(200).send({ success: 'Bot is offline' }))
        .catch(e => res.status(422).send({ error: e }))
}

function On (req, res) {
    client.login(token)
        .then(() => res.status(200).send({ success: 'Bot is online' }))
        .catch(e => res.status(422).send({ error: e }))
}

async function Restart (req, res) {
    try {
        await client.destroy()
        await client.login(token)
    } catch (e) {
        return res.status(422).send(e)
    }

    return res.status(200).send({ success: 'Bot restarted' })
}

module.exports = {
    Off,
    On,
    Restart
}