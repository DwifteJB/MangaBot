const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const {sqlite,CreateDefault,} = require("../lib/DatabaseHelper")
const Keyv = require('keyv');
const Settings = new Keyv(sqlite, {
    namespace: 'Users'
});
module.exports = {
  name: "settings",
  description: "Display all of your settings.",
  type: "utility",
  slashCommandData: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Display all of your settings.'),
  async execute(client, message, args) {
    const user = message.user || message.author
    await CreateDefault(user.id)
    const UserSettings = await Settings.get(user.id)
    let API = UserSettings.api;
    let Embed = new EmbedBuilder()
      .setColor(9762231)
      .addFields({name:"API being used:",value:`\`${API}\``})
      .setAuthor({name:user.username + " Settings",URL:"https://discord.com/oauth2/authorize?client_id=1041057999667613746&scope=bot&permissions=412317207552",iconURL:user.displayAvatarURL()}) 
      .setFooter({text:"Want to change your settings? Use /changesettings!"}) 
      .setThumbnail(message.guild.iconURL());


      await message.reply({embeds:[Embed],ephemeral: true})
  }
};