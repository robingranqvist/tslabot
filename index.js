// Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Discord
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// Scrape
const axios = require('axios');
const cheerio = require('cheerio'); 

let price;
let priceArr;
let curPrice;
let curArrow;
let curDollars;
let curPerc;

const url = 'https://www.stockmonitor.com/quote/tsla/';

app.listen(PORT, () => {

    client.on('ready', () => {
        client.user.setPresence({ activity: { name: '🤑🤑🤑' }, status: 'online' })
        .then(console.log)
        .catch(console.error);
        
        setTimeout(function(){ console.log("Hello"); }, 300000);
    });
    // Discord

    client.on('message', message => {

        if (message.content === `${prefix}tsla`) {

            // Scrape shit
            getShit();
            message.channel.send(curPrice + " " + curArrow + " " +curDollars + " " + curPerc);
        }
    });

    function fixShit(str) {
        str = str.replace(/(\r\n|\n|\r)/gm, "");
        str = str.trim();
        str = str.split(" ");
        return str;
    }

    function fixString() {
        curPrice = "$" + priceArr[0];
        curArrow = priceArr[1];
        curDollars = "$" + priceArr[2];
        curPerc = priceArr[3];
    }

    function getShit() {
        axios.get(url)
            .then(res => {
                const $ = cheerio.load(res.data);
                price = $('.price-and-changes').text();
                priceArr = fixShit(price);

                // Splitted
                fixString();
            })
            .catch(err => console.log(err));
    }

    client.login(token);
})

