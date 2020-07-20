require('dotenv').config();

const secrets = {
    "discord": {
        "token": process.env.DISCORD_TOKEN,
        "BOTID": process.env.DISCORD_CLIENTID,
    },
    "webhook": {
        "log": {
            "id": process.env.WEBHOOK_ID,
            "token": process.env.WEBHOOK_TOKEN,
        }
    }
}


module.exports = secrets;
