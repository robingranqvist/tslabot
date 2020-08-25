// Server
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Discord
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.login(token);

const axios = require('axios');
let oldPriceArr = [];

/*
Checks the price every 5 minutes
*/

app.listen(PORT, () => {

    client.on('ready', () => {
        let channel = client.channels.cache.get('247467831480811520');
        console.log(channel);
        client.user.setPresence({ activity: { name: '🤑🤑🤑' }, status: 'online' })
        .then(console.log)
        .catch(console.error);
        
        setInterval(function(){
            let currentData = getTsla();
            currentData.then(function(res) {
                // Current
                
                let c = Math.round(res.c);
                oldPriceArr.push(c);
                oldPriceLast = oldPriceArr[oldPriceArr.length - 2];
                
                // Stores only 10 last items
                if (oldPriceArr.length >= 10) {
                    oldPriceArr.splice(0, 1);
                }
    
                console.log(oldPriceArr);
                // Open
                // let o = Math.round(res.o);
                let currentNegative = oldPriceLast - c;
                let currentPositive = c - oldPriceLast;
                if (oldPriceArr.length > 2) {
                    if ((oldPriceLast - c) > 1) {
                        channel.send("ALERT, WE'RE GOING DOWN BOIS! ", "-$" + currentNegative);
                    } else if ((c - oldPriceLast) > 1) {
                        channel.send("WE'RE GOING UP BOIS! ", "+$" + currentPositive);
                    } else {
                        channel.send("Current price is ", "+$" + c);
                    }
                }
                console.log(c, oldPriceLast);
    
                
            });
        }, 1000);
    });
    
    async function getTsla() {
        try {
            let response = await axios.get('https://finnhub.io/api/v1/quote?symbol=TSLA&token=bt2h7mv48v6sbbrqq5jg');
            return response.data;
        } catch (error) {
            return error.response.body;
        }
    }

});