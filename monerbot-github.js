#!/usr/bin/env node
// for systemd

'use strict';

const Discord = require('discord.js');
const mysql = require('mysql');
const client = new Discord.Client();

const regex = /^\$moner( help| count| suggest .+|)/gi;
const suggestRegex = /^\$moner suggest /gi;
var currency = ["moners", "yugnars", "euro", "dabloons", "dineros", "manats", "gugaloons", "gugungagayns", "sand dollars", "flongas", "shlegnats", "blorgos", "frittatas", "galindos", "deniz nakamuras", "guglamofflers", "bologiomas", "goonaras", "booraababooraas", "gigajebalos", "schinters", "scribuntos", "jugogalogs", "shanoogies", "bahoggers", "glognags", "bergelenz", "tortellinis", "bazingas", "smackaroos", "hurabarandas", "gecs", "esperantos", "csbongos", "bangalones", "furknerts", "yelnates", "rugbalooms", "gliglars", "smugars", "ungaloos", "grunkles", "kunucks", "giggleschwomps", "smegmars", "bumbershoot", "dongangonals", "quibis", "shabooyahs", "quiznos", "grongaboganls", "shumplings", "gringobringos", "gungareas"];
var cLength = currency.length;
var amount = 0;

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    console.log("Currency count: " + cLength);
})

client.on('message', message => {
    var regexTest = regex.test(message.content);
    if (regexTest === true) {
        switch (message.content.match(regex)[0]) {
            case "$moner help":
                message.channel.send("__**MonerBot Commands**__\n`$moner` Main command. Outputs a random number with a random currency.\n`$moner help` Outputs the message you're looking at right now.\n`$moner count` Outputs the number of currencies that are currently in the bot.\n`$moner suggest CURRENCY` Use this to suggest a new currency to be added! Replace CURRENCY with your suggestion. Note that your currency will not be added right away; I have to approve them first so that the bot isn't filled with trash submissions");
                break;
            case "$moner count":
                message.channel.send("Currency count: " + cLength);
                break;
            case "$moner":
                // Here is the actual moner part
                // Create a 1 in 3 chance for the amount to be negative
                var sign = Math.floor(Math.random() * 3);
                if (sign == 0) {
                    amount = Math.floor(Math.random() * -299) - 2;
                } else {
                    amount = Math.floor(Math.random() * 299) + 2;
                }
                var cNum = Math.floor(Math.random() * cLength); // Choose an item from the array
                var output = amount + " " + currency[cNum];
                message.channel.send(output);
                break;
            default:
                if (suggestRegex.test(message.content) === true) {
                    var suggestion = message.content.replace(suggestRegex, "");
                    var author = message.author.id;
                    
                    // connect to mysql database
                    var connection = mysql.createConnection({
                        host: "REDACTED",
                        user: "REDACTED",
                        password: "REDACTED",
                        database: "REDACTED"
                    });
                    var sql = "INSERT INTO currencysuggest (suggestion, author, approved) VALUES (" + connection.escape(suggestion) + ", " + connection.escape(author) + ", 'no')";
                    connection.query(sql, function (error, results, fields) {
                        console.log("Sent query to the database: " + sql);
                        if (error) {
                            console.log("MySQL ERROR: " + error);
                            message.channel.send("❌ There was an error while trying to send your suggestion to the database.");
                        } else {
                            message.channel.send("✅ Your suggestion has been sent for approval!");
                        }
                        if (results) {console.log("Query results: " + results);}
                        if (fields) {console.log("Info on the results fields: " + fields);}
                    });
                    connection.end();
                } else {
                    console.log("!!! Got to the switch but did not match any of the cases? Matched: " + message.content.match(regex)[0]);
                }
        }
    } else {
        return;
    }
})

// Use bot token from https://discord.com/developers/applications/
client.login("REDACTED");