const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {sqlite} = require("../lib/DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});

module.exports = {
  name: "about",
  description: "View some bot info",
  type: "utility",
  slashCommandData: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Shows you all you can do with me!'),
  async execute(client, message, args) {
    let Kitsu = await ResponseTime.get("Kitsu")
    let Jikan = await ResponseTime.get("Jikan")
    let Embed = new EmbedBuilder()
      .setDescription("**A simple bot for searching up mangas!**")
      .setColor("#029aff")
      .addFields({name:"Usages",value:"```diff\n+ [[Parasyte]]\n+ m!search Parasyte\n+ /search Parasyte\n+ I've been thinking of watching [[Parasyte]]!\n```"})
      .addFields({name:"Response Time",value:`\`\`\`diff\n\n- Kitsu\n+ ${Kitsu || 0}ms\n\n- Jikan\n+ ${Jikan || 0}ms\`\`\``})
      .setAuthor({name:"About MangaBot",URL:"https://discord.com/oauth2/authorize?client_id=1041057999667613746&scope=bot&permissions=412317207552"})
      .setFooter({text:"Created by Dwifte"});

      await message.reply({embeds:[Embed]})
  }
};