const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// Scrape
const axios = require('axios');
const cheerio = require('cheerio');

let price;
let percentage;
let oldPrices = [];
let prev;
const url = 'https://www.stockmonitor.com/quote/tsla/';

app.listen(PORT, () => {

    // Discord
    client.once('ready', () => {
        console.log("ready");
    });

    client.on('message', message => {

        if (message.content === `${prefix}tsla`) {
            // Scrape data
            axios.get(url)
                .then(res => {
                    const $ = cheerio.load(res.data);
                    price = $('.price-and-changes').text();

                })
                .catch(err => console.log(err));
            
            message.channel.send(price);
        }

        if (message.content === `${prefix}tslapre`) {
            message.channel.send("$" + price * 5);
        }
    });

    client.login(token);

})

