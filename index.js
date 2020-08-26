// Server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Discord
const Discord = require("discord.js");
const { token, channel } = require("./config.json");
const client = new Discord.Client();
client.login(token);

const axios = require("axios");
const oldPriceArr = [];
const MAX_OLD_PRICE_ARR = 10;

/*
Checks the price every 5 minutes
*/
app.listen(PORT, () => {
  client.on("ready", () => {
    // Gets the "flappy-channel"
    let channel = client.channels.cache.get(channel);

    // Sets user activity
    client.user
      .setPresence({ activity: { name: "🤑🤑🤑" }, status: "online" })
      .then(console.log)
      .catch(console.error);

    // Activates every n seconds
    setInterval(function() {
      let currentData = getTsla();
      currentData.then(function(res) {
        let oldPriceLast =
          oldPriceArr.length > 0
            ? oldPriceArr[oldPriceArr - 1] // Get last in array
            : 0; // Init at 0
        let c = Math.round(res.c);
        oldPriceArr.push({ c, timestamp: +new Date() });

        // Stores only MAX_OLD_PRICE_ARR items
        if (oldPriceArr.length >= MAX_OLD_PRICE_ARR) {
          oldPriceArr.splice(0, 1);
        }

        let currentNegative = oldPriceLast.c - c;
        let currentPositive = c - oldPriceLast.c;
        if (oldPriceArr.length > 2) {
          if (oldPriceLast.c - c > 5) {
            channel.send(
              "ALERT, WE'RE GOING DOWN BOIS! " +
                "-$" +
                currentNegative +
                " Price atm: $" +
                c
            );
          } else if (c - oldPriceLast.c > 5) {
            channel.send(
              "WE'RE GOING UP BOIS! " +
                "+$" +
                currentPositive +
                " Price atm: $" +
                c
            );
          }
        }
      });
    }, 60000);
  });

  async function getTsla() {
    try {
      let response = await axios.get(
        "https://finnhub.io/api/v1/quote?symbol=TSLA&token=bt2h7mv48v6sbbrqq5jg"
      );
      return response.data;
    } catch (error) {
      return error.response.body;
    }
  }
});
