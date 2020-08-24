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

    // Discord
    client.once('ready', () => {
        console.log("ready");
    });

    client.on('message', message => {

        if (message.content === `${prefix}tsla`) {
            // Scrape data
            getShit();
            message.channel.send(curPrice + " " + curArrow + " " +curDollars + " " + curPerc);
        }

        if (message.content === `${prefix}tslapre`) {
            getShit();
            message.channel.send("$" + price * 5);
        }

        if (message.content === `${prefix}fredda`) {
            getShit();
            message.channel.send(price * 16);
        }
    });

    client.login(token);

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

    function getPrice() {
        axios.get(url)
            .then(res => {
                const $ = cheerio.load(res.data);
                price = $('.price-and-changes').text();
                priceArr = fixShit(price);
                return price;
            })
            .catch(err => console.log(err));
    }
})

