const concurrently = require('concurrently');
const express = require("express");


const { InteractionType, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');


const fs = require("fs");
const ascii = require("ascii-table");
this.fetch = require("node-fetch");
let fetch = require("node-fetch");
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const url = require("url");
const moment = require('moment')
var clc = require("cli-color");
const cnfg = require("./config.json");

const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.GuildPresences, 
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    //  	GatewayIntentBits.GuildMembers, 
  ],

});


client.slash = new Collection();
['slashCommand',].forEach((handler) => {
  require(`./handlers/${handler}`)(client)
});
// process.on("uncaughtException", (err) => {
//   console.log("Uncaught Exception: " + err);
// });  
process.on("unhandledRejection", (reason, p) => {

  console.log(reason, p);
});  

const app = express();
const port = 3000

app.get('/', (req, res) => res.send('Yo new gen bot!!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
);
client.login(process.env.token).then(() => {

  console.log(
    ` Successfully logged in as: ${client.user.tag} ${client.user.id}`);
});
      
client.on(`interactionCreate`, async interaction => {

  if (interaction.type === InteractionType.ApplicationCommand) {

   
    const command = client.slash.get(interaction.commandName);
    if (!command) return interaction.reply({ content: 'tf.' });


    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
        option.options?.forEach(x => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    try {

      command.run(client, interaction, args)
    } catch (e) {
      interaction.reply({ content: e.message });
    }
  }
})

