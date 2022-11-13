const {SlashCommandBuilder,EmbedBuilder, ActionRowBuilder, SelectMenuBuilder, ComponentType} = require("discord.js");
const Search = require("../lib/Search")
const Manga = require("../lib/MangaDatabases/kitsu");
module.exports = {
  name: "search",
  description: "Search up some manga!",
  type: "utility",
  slashCommandData: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for manga!')
    .addStringOption(option =>
      option
      .setRequired(true)
      .setName("manga")
      .setDescription("Name of the manga you would like to lookup.")),
  async execute(client, message, args) {
    let MangaName
    let Type 
    if (args && args[0]) {
      MangaName = args.join(" ")
      Type = 0 // msg
    } else if (message.options && message.commandId) {
      MangaName = message.options.getString("manga")
      Type = 1 // interaction
    }

    if (MangaName == null) {
      message.reply("You didn't specify a manga!")
      return;
    } else {
      const RemoveThis = (Type == 0) ? await message.channel.send("Waiting for response from api <a:loading:1041138672151564329>") : await message.deferReply();
      // manga lookup
      const AnimeData = await Manga.LookupMangaByName(MangaName);
      if (AnimeData == false) {
          message.reply("Couldn't find the specified manga!")
          return;
      }
      let Embeds = Search.CreateEmbeds(AnimeData)

      const row = new ActionRowBuilder()
        .addComponents(
          new SelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder(Embeds[0].data.title)
        );
      for (index in Embeds) {
          row.components[0].addOptions({label:Embeds[index].data.title || "Not Found",description:Embeds[index].data.description.substring(0,80)+"...",value:index})
      }
      (Type == 0) ? RemoveThis.delete() : null;
      if (Type == 0) {
        let SentMSG = await message.reply({components: [row], embeds: [Embeds[0]] });

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
      } else {



        const msg = await message.editReply({components: [row], embeds: [Embeds[0]], fetchReply: true })

        console.log(message)

        console.log(msg)
        const filter = i => {
          i.deferUpdate();

          return i.user.id === message.user.id;
        };
        
        const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 60000 })
        collector.on("collect", interaction => {
            row.components[0].setPlaceholder(Embeds[interaction.values[0]].data.title || "Not Found!")
            msg.edit({components: [row], embeds: [Embeds[interaction.values[0]]] })
        });
        collector.on("end", c => {
          msg.edit({components: []})
        })
      }

      //message.reply(MangaName + Type.toString())
        
      }

  }
};