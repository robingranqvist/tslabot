const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// Scrape
const axios = require('axios');
const cheerio = require('cheerio');

let price;
let percentage;



// Discord
client.once('ready', () => {
    console.log("Ready");
});

client.on('message', message => {
    // Scrape
    axios.get('https://stocktwits.com/symbol/TSLA')
    .then(res => {
        const $ = cheerio.load(res.data);

        price = $('.st_3zYaKAL').text();
        percentage = $('.st_3Z2BeqA').text();
        console.log("Pris:", price);
        console.log(percentage);
    })
    .catch(err => console.log(err));

    if (message.content === `${prefix}tsla`) {
        message.channel.send("$" + price);
    }

    if (message.content === `${prefix}tslapre`) {
        message.channel.send("$" + price * 5);
    }
});

client.login(token);