const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,SelectMenuBuilder,ComponentType} = require("discord.js");
const {sqlite,CreateDefault} = require("../lib/DatabaseHelper")
const Keyv = require('keyv');
const Settings = new Keyv(sqlite, {
    namespace: 'Users'
});
const DBOptions = require("../DatabaseOptions.json")
module.exports = {
  name: "changesettings",
  description: "Changes a setting",
  type: "utility",
  slashCommandData: new SlashCommandBuilder()
    .setName('changesettings')
    .setDescription('Changes a setting'),
  async execute(client, message, args) {
    const user = message.user || message.author
    console.log(user.id)
    CreateDefault(user.id)
    const UserSettings = await Settings.get(user.id)
    let Embed = new EmbedBuilder()
        .setColor(9762231)
        .setAuthor({name:user.username + " Settings",URL:"https://discord.com/oauth2/authorize?client_id=1041057999667613746&scope=bot&permissions=412317207552",iconURL:user.displayAvatarURL()})
        .setDescription("What setting would you like to change?");

    const row = new ActionRowBuilder()
        .addComponents(
        new SelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder("No setting selected.")
        );
    for (index in UserSettings) {
        row.components[0].addOptions({label:index ,description:"Currently: " + UserSettings[index],value:index})
    }
    const msg = await message.reply({components: [row], embeds: [Embed], fetchReply: true })

    let filter;
    if (message.commandId) {
        filter = i => {
            i.deferUpdate();
    
            return i.user.id === message.user.id;
        };
        
    } else {
        filter = i => {
            i.deferUpdate();
    
            return i.user.id === message.author.id;
        };
        
    }
    msg.awaitMessageComponent({filter,componentType: ComponentType.StringSelect, time: 60000 })
        .then(async i => {
            console.log(i);
            const ChosenSetting = i.values[0]
            Embed.setDescription(`What would you like to change ${ChosenSetting} to?`)
            const SecondSelect = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('select2')
                    .setPlaceholder("No option selected.")
                );
            
            for (index in DBOptions[ChosenSetting]) {
                SecondSelect.components[0].addOptions({label:DBOptions[ChosenSetting][index] ,description:"Change to this: " + DBOptions[ChosenSetting][index] + "?",value:DBOptions[ChosenSetting][index]})
            }
            await msg.edit({embeds:[Embed],components:[SecondSelect]})
            msg.awaitMessageComponent({filter,componentType: ComponentType.StringSelect, time: 60000 })
            .then(async i => {
                UserSettings[ChosenSetting] = i.values[0]
                await Settings.set(user.id,UserSettings)
                Embed.setDescription(`Successfully changed ${ChosenSetting} to ${i.values[0]}`)
                msg.edit({embeds: [Embed],components:[]})
            })
            .catch(c => {
                msg.edit({embeds: [Embed],components:[]})
            })
        })
        .catch(c => {
            msg.edit({embeds: [Embed],components:[]})
        })
  }
};