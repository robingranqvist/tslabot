const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// Scrape
const axios = require('axios');
const cheerio = require('cheerio');

let price;
let percentage;

axios.get('https://stocktwits.com/symbol/TSLA')
    .then(res => {
        const $ = cheerio.load(res.data);

        price = $('.st_3zYaKAL').text();
        percentage = $('.st_3Z2BeqA').text();
        console.log("Pris:", price);
        console.log(percentage);
    })
    .catch(err => console.log(err));

// let TSLA;

// const data = fetch(url)
//     .then(response => response.json())
//     .then(data => {
//         TSLA = Math.floor(data['Time Series (Daily)']['2020-08-21']['4. close']);
//     })
//     .catch(err => console.log(err));

client.once('ready', () => {
    console.log("Ready");
});

client.on('message', message => {

    if(message.content.startsWith(`${prefix}tsla`)) {
        message.channel.send(price);
    }
});

client.login(token);