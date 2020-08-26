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
let jsdom = require("jsdom");
let Buffer = require("buffer").Buffer;
let svg2png = require("svg2png");

const oldPriceArr = [];
const MAX_OLD_PRICE_ARR = 10;
const THRESHOLD = 5;

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
          if (oldPriceLast.c - c > THRESHOLD) {
            channel.send(
              "ALERT, WE'RE GOING DOWN BOIS! " +
                "-$" +
                currentNegative +
                " Price atm: $" +
                c
            );
          } else if (c - oldPriceLast.c > THRESHOLD) {
            channel.send(
              "WE'RE GOING UP BOIS! " +
                "+$" +
                currentPositive +
                " Price atm: $" +
                c
            );
          }

          // Test
          const image = createImg();
          const imageStream = new Buffer(image, "base64");
          const attachment = new Discord.MessageAttachment(imageStream);
          const embed = new discord.RichEmbed()
            .attachFile(attachment)
            .setDescription(rant.text);
          channel.send({ embed });
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

const createImg = () => {
  return new Promise(function(resolve, reject) {
    try {
      jsdom.env(
        '<svg id="svg"></svg>',
        ["http://d3js.org/d3.v3.min.js"],
        function(err, window) {
          let svg = window.d3
            .select("svg")
            .attr("width", 100)
            .attr("height", 100)
            .attr("xmlns", "http://www.w3.org/2000/svg");

          svg
            .append("rect")
            .attr("x", 10)
            .attr("y", 10)
            .attr("width", 80)
            .attr("height", 80)
            .style("fill", "orange");

          let data = "data:image/png;base64,";
          let svgString = svg[0][0].outerHTML;
          let buffer = new Buffer(
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
              svgString
          );
          let promise = svg2png(buffer, { width: 300, height: 400 });
          promise.then(buffer => {
            let dataURI = data + buffer.toString("base64");
            resolve(dataURI);
          });
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};
