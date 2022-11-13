const Discord = require("discord.js");

const {InteractionHandler} = require("../lib/loader");
module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    let IHandle = new InteractionHandler(client,interaction)
    if (IHandle.command) {
        if (IHandle.checkPermissions() != false) {
            IHandle.command.execute(client,interaction);
        } else {
            interaction.reply("You don't have enough permissions <:3dsadsmiley:1012402373550932108>")
        }
    }
  
}