### Summary ###
Professor Redwood has arrived from the California Bay Area. He will help you run your local discord communities for Pokemon GO. See our bot in action on the SF PoGo Raids Meetup https://discord.gg/9MJdRZm

### How do I contribute? ###
Make a pull request!

### How do I get set up? ###
To run this bot you will need a ES6 node environment. The bot currently does not have database functions.

1) Create a role called mod and give it the following privileges:
- Display role members separately from online members
- Manage Roles
- Check all boxes under Text Permissions
2) Create roles (this will take a while):
- currently roles must be completely lowercase or youre going to have a bad time see https://github.com/stefangimmillaro/Professor-Redwood/issues/22
- valor, instinct, and mystic: all with at least: Display role members seperately, Read & Send Messages (recommend unchecking Mention Everyone), and color each team appropriately
- create one role for each region that you plan to use. Regions consist of multiple channels. Channels consist of multiple neighborhoods. Examples in SF are: sf, peninsula, sanjose, eastbay
- create a role named 'allregions'
- create a role for each rare pokemon, Tier 3-5 raid boss, and 'highiv', 'legendary', 'finalevo', 'exgym'. **All of these roles must have the 'allow anyone to @mention this role'
3) Create Channels:
- professor_redwood (a channel specifically for bot commands) - @everyone may Read & Send messages
- gymraids_alerts (required for alert forwarding) - only admin/mod/3 teams should have Send Message privilege, @everyone should have no privilege
- start_here (required for instructing users on bot usage) - only admin/mod roles should have Send Message privilege, @everyone should have Read only
- neighborhood channels! When creating these, make sure to use '-' in each name, even if it's at the beginning or end. Proper examples are pier39-marina and sanjose-
-- make sure to only allow allregions and the appropriate region role to access each channel
- regional gym channels, each region role you created should have a corresponding gym channel, called gymraids_ + the name of your region role
4) Create your bot
- Go to your discord developers page: https://discordapp.com/developers/applications/me
- Click New App
- Under App Name, type 'Professor Redwood', or another name for your bot
- Click Create App
- Click Create a Bot User
- Under App Details, click to reveal the Token (This is your token needed for the bot code!)
- Copy the Token, and paste it into your secrets.js file under BOTID
- Now, copy the Client ID and paste it into this URL: https://discordapp.com/oauth2/authorize?&client_id=<CLIENT ID>&scope=bot&permissions=0
- Choose the name of your Discord server
- Authorize the Bot!
- Go to the Server Settings for your discord, and search for a user/member, find your bot and grant it mod privileges
5) Go to the config folder and create a secrets.json. Follow instructions in the config/readme.txt.
6) Run your bot
node bot.js
