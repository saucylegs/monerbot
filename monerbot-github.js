#!/usr/bin/env node
// for systemd

// Start with TOKEN='<discord bot token>' MYSQL_HOST='<host ip>' MYSQL_USER='<username>' MYSQL_PASSWORD='<password>' MYSQL_DATABASE='<database>' node ./monerbot-github.js

'use strict';

const Discord = require('discord.js');
const mysql = require('mysql');
const client = new Discord.Client();

const regex = /^\$moner( help| count| suggest .+|)/gi;
const suggestRegex = /^\$moner suggest /gi;
var currency = require('./currencies');
var cLength = currency.length;
var amount = 0;

// Embed for the Help command output
const helpEmbed = {
    color: 0x349e48,
    title: "MonerBot Commands & Info",
    thumbnail: {
        url: "https://cdn.discordapp.com/avatars/737476809477587034/2694d750d43f34d3da332bbc18251774.png?size=256",
    },
    fields: [
        {
            name: "Commands",
            value: "- `$moner` - Main command. Outputs a random number with a random currency. \n- `$moner help` - Outputs the message you're looking at right now. \n- `$moner count` - Outputs the number of currencies that are currently in the bot. \n- `$moner suggest CURRENCY` - Use this to suggest a new currency to be added! Replace CURRENCY with your suggestion. Note that your currency will not be added right away; I have to approve them first so that the bot isn't filled with trash submissions \n \u200b",
        },
        {
            name: "Note for Moderators",
            value: 'To ban someone from using MonerBot, give them a role called "0 moners" (name must be exact). This will prevent them from using all commands except `$moner help`. \n \u200b',
        },
        {
            name: "Bot Info",
            value: "[r/Moners Discord](https://discord.gg/zJbfhDu) | [Invite MonerBot](https://discord.com/api/oauth2/authorize?client_id=737476809477587034&permissions=68608&scope=bot) | [GitHub](https://github.com/saucylegs/monerbot) | Creator: Saucy#6942",
        },
    ],
};

function moner() {
    // Here is the actual moner part
    // Create a 1 in 3 chance for the amount to be negative
    if (Math.floor(Math.random() * 3) === 0) {
        // The moner value should be >1 and <300, or <-1 and >-300.
        amount = Math.floor(Math.random() * -299) - 2;
    } else {
        amount = Math.floor(Math.random() * 299) + 2;
    }
    var cNum = Math.floor(Math.random() * cLength); // Choose an item from the array
    var output = amount + " " + currency[cNum];
    return output;
}

function playingMoner() {
    // Generate a new moner for Playing... every 10 minutes
    var output = moner();
    client.user.setActivity(output);
}

client.on('ready', () => {
    console.log("Connected as ", client.user.tag);
    console.log("Currency count: ", cLength);

    // Generate a new moner for Playing... every 10 minutes
    playingMoner();
    setInterval(playingMoner, 600000);
})

client.on('message', message => {
    var regexTest = regex.test(message.content);
    if (regexTest === true) {
        switch (message.content.match(regex)[0].toLowerCase()) {
            case "$moner help":
                message.channel.send({embed:helpEmbed});
                break;
            case "$moner count":
                if (message.member) {
                    if (message.member.roles.cache.some(role => role.name === '0 moners')) {
                        message.channel.send("❌ A server moderator has banned you from using MonerBot.");
                        break;
                    }
                }
                message.channel.send("Currency count: " + cLength);
                break;
            case "$moner":
                if (message.member) {
                    if (message.member.roles.cache.some(role => role.name === '0 moners')) {
                        message.channel.send("❌ A server moderator has banned you from using MonerBot.");
                        break;
                    }
                }
                var output = moner();
                message.channel.send(output);
                break;
            default:
                if (message.member) {
                    if (message.member.roles.cache.some(role => role.name === '0 moners')) {
                        message.channel.send("❌ A server moderator has banned you from using MonerBot.");
                        break;
                    }
                }
                if (suggestRegex.test(message.content) &&
                    process.env.MYSQL_HOST &&
                    process.env.MYSQL_USER &&
                    process.env.MYSQL_PASSWORD &&
                    process.env.MYSQL_DATABASE) {
                    var suggestion = message.content.replace(suggestRegex, "");
                    var author = message.author.id;

                    // connect to mysql database
                    var connection = mysql.createConnection({
                        host: process.env.MYSQL_HOST,
                        user: process.env.MYSQL_USER,
                        password: process.env.MYSQL_PASSWORD,
                        database: process.env.MYSQL_DATABASE
                    });
                    var sql = "INSERT INTO currencysuggest (suggestion, author, approved) VALUES (" + connection.escape(suggestion) + ", " + connection.escape(author) + ", 'no')";
                    connection.query(sql, function(error, results, fields) {
                        console.log("Sent query to the database: " + sql);
                        if (error) {
                            console.log("MySQL ERROR: " + error);
                            message.channel.send("❌ There was an error while trying to send your suggestion to the database.");
                        } else {
                            message.channel.send("✅ Your suggestion has been sent for approval!");
                        }
                        if (results) { console.log("Query results: " + results); }
                        if (fields) { console.log("Info on the results fields: " + fields); }
                    });
                    connection.end();
                } else {
                    console.log("!!! Got to the switch but did not match any of the cases? Matched: ", message.content.match(regex)[0]);
                }
        }
    } else {
        return;
    }
})

// Use bot token from https://discord.com/developers/applications/
client.login(process.env.TOKEN);
