# MonerBot
-27 yugnars

Relatively simple Discord bot that pairs a random number with a random-made up currency. Also contains a feature to suggest a new currency to be added.

Bot invite link: https://discord.com/api/oauth2/authorize?client_id=737476809477587034&permissions=68608&scope=bot

## Bot commands
`$moner` - The main command. Outputs a random number with a random currency.

`$moner help` - Full list of commands

## How the bot works
### Dependencies
The bot is written in JavaScript. To run, it requires node.js with the discord.js and mysql packages. The suggestions feature requires a pre-configured MySQL database.

### Selfhost quickstart

1. Clone the repository
```bash
git clone https://github.com/saucylegs/monerbot
cd monerbot
```

2. Install dependencies
```bash
npm install
```

3. Start monerbot
```bash
TOKEN='<discord bot token>' MYSQL_HOST='<host ip>' MYSQL_USER='<username>' MYSQL_PASSWORD='<password>' MYSQL_DATABASE='<database>' node ./monerbot-github.js
```

You can omit the MySQL variables to disable the suggestions feature.
