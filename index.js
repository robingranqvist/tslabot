const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

// API
const fetch = require('node-fetch');
const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=349CBXO0QJ1EIWJX";

let TSLA;

const data = fetch(url)
    .then(response => response.json())
    .then(data => {
        TSLA = Math.floor(data['Time Series (Daily)']['2020-08-21']['4. close']);
    })
    .catch(err => console.log(err));

client.once('ready', () => {
    console.log("Ready");
});

client.on('message', message => {
    console.log(message.content);

    if(message.content.startsWith(`${prefix}tsla`)) {
        message.channel.send("$" + TSLA);
    }

    if(message.content.startsWith(`${prefix}fredda`)) {
        message.channel.send("FREDDA ÄGER: " + "$" + TSLA * 16);
    }

    if(message.content.startsWith(`${prefix}vinst`)) {
        message.channel.send("FREDDAS VINST: " + "$" + (TSLA * 16 - 5000) );
    }

    if(message.content.startsWith(`${prefix}pedo`)) {
        message.channel.send("https://ibb.co/DwBymd0");
    }

    if(message.content.startsWith(`${prefix}help`)) {
        message.channel.send("Men pappa ja vilit.");
    }
});

client.login(token);