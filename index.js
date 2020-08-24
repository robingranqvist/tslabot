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
let priceStr = "";
let oldPrice;

app.listen(PORT, () => {

    // Discord
    client.once('ready', () => {
        console.log("ready");
    });

    client.on('message', message => {

        if (message.content === `${prefix}tsla`) {
            // Scrape data
            const test = async function () {
                axios.get('https://stocktwits.com/symbol/TSLA')
                .then(res => {
                    const $ = cheerio.load(res.data);

                    price = $('.st_3zYaKAL').text();
                    percentage = $('.st_3E7muvq').text();

                    // To array
                    oldPrices.append(price);
                    return price;
                })
                .catch(err => console.log(err));
            }

            // Message
            //message.channel.send("$" + price + " " + percentage);
            message.channel.send(await test());
        }

        if (message.content === `${prefix}tslapre`) {
            message.channel.send("$" + price * 5);
        }
    });

    client.login(token);

})

