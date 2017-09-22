Create a secrets.json in this directory with the following structure

{
  "discord": {
    "token": "roughly 60 character token",
    "BOTID": "012345678910111213"
  },
  "mysql": {
    "host": "localhost",
    "user": "admin",
    "password": "password",
    "database": "discordDB"
  },
  "webhook": {
    "log": {
	  "id": "012345678910111213",
	  "token": "68charactertoken"
    }
  }
}

The discord credentials are required.
Mysql is for optional features.
Webhook is for debugging to a discord channel.