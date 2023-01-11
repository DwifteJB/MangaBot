const {ActionRowBuilder, SelectMenuBuilder, ComponentType} = require("discord.js");
const {MessageHandler} = require("../lib/loader")
const Manga = require("../lib/MangaDatabases/Helper")
const {sqlite,CreateDefault} = require("../lib/DatabaseHelper")
const Keyv = require('keyv');
const Settings = new Keyv(sqlite, {
    namespace: 'Users'
});
module.exports = async (client, message) => {
    if(message.author.bot) return;
    const Handler = new MessageHandler(client,message)

    let {command, arguments} = await Handler.getCommand()
    if (!client.commands.get(command)) command = await Handler.getAliases(command)
    // Permission checks
    if (command) {
        if (await Handler.checkPermissions() == false) return message.reply(`You can't do this!`);
        try {
            client.commands.get(command).execute(client,message,arguments);
        } catch (error) {
            console.log(error);
            message.reply('There was an error trying to execute that command!');
        }
    } else {
        const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
        if (!matches) return;
        await CreateDefault(message.author.id)
        // manga lookup
        const UserSettings = await Settings.get(message.author.id)
        const API = UserSettings.api
        let Embeds = await Manga.GetEmbeds(API,matches[1])
        
        if (Embeds == false) {
            await message.reply("Couldn't find any manga with that name.");
            return;
        } else if (Embeds == true) {
            await message.reply("We couldn't find the API used in your settings: "+API+"\nIt's either down for maintenance, or no longer supported.");
            return;
        }
 


		const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder(Embeds[0].data.title)
			);
        for (index in Embeds) {
		var title
		if (Embeds[index].data.title) {
			title = Embeds[index].data.title.substring(0,80)+"..."
		} else {
			title = "Not Found"	
		}
            row.components[0].addOptions({label:title ,description:Embeds[index].data.description.substring(0,80)+"...",value:index})
        }
		const SentMSG = await message.reply({components: [row], embeds: [Embeds[0]] });
        const filter = i => {
            i.deferUpdate();

            return i.user.id === message.author.id;
        };
        
        const collector = SentMSG.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 60000 })
        collector.on("collect", interaction => {
            row.components[0].setPlaceholder(Embeds[interaction.values[0]].data.title || "Not Found!")
            SentMSG.edit({components: [row], embeds: [Embeds[interaction.values[0]]] })
        });
        collector.on("end", c => {
            SentMSG.edit({components: []})
        })
        
    }


  
}
