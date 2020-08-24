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

app.listen(PORT, () => {

    // Discord
    client.once('ready', () => {
        console.log("Ready");
    });

    client.on('message', message => {

        if (message.content === `${prefix}tsla`) {
            axios.get('https://stocktwits.com/symbol/TSLA')
            .then(res => {
                const $ = cheerio.load(res.data);

                price = $('.st_3zYaKAL').text();
                percentage = $('.st_3Z2BeqA').text();

                // To array
                if (oldPrices.length <= 10) {
                    oldPrices.append(price);
                }
            })
            .catch(err => console.log(err));
            message.channel.send("$" + price);
        }

        if (message.content === `${prefix}tslapre`) {
            message.channel.send("$" + price * 5);
        }

        if (message.content === `${prefix}test`) {
            message.channel.send(oldPrices);
        }

    });

    client.login(token);

})

