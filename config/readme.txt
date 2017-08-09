Create a secrets.json in this directory with the following structure

{
  "discord": {
    "token": "roughly 60 character token",
    "BOTID": "18 character numeric id",
	"ROLE_IDS": {
	  "@legendary": "18 character numeric id"
	}
  },
  "mysql": {
    "host": "localhost",
    "user": "admin",
    "password": "password",
    "database": "discordDB"
  },
  "DATABASE_URL": "MongoDB URL here (i.e. mongodb://localhost:27017/organize-raid)",
  "GOOGLE_API_KEY": "google places api key here" 
}