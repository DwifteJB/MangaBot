/*
    Grookey: Main client script
*/
const Discord = require("discord.js");
const config = require("../config");
const {Loader} = require("./lib/loader")

const Indt = new Discord.IntentsBitField()
Indt.add(Discord.IntentsBitField.Flags.GuildMessages,Discord.IntentsBitField.Flags.GuildPresences, Discord.IntentsBitField.Flags.GuildMembers,Discord.IntentsBitField.Flags.Guilds,Discord.IntentsBitField.Flags.MessageContent);
config.client.intents = Indt
const Client = new Discord.Client(config.client);

Client.login(process.env.TOKEN);

new Loader(Client)


module.exports = Client;

