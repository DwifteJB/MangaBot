/*
    Grookey: Main client script
*/
const Discord = require("discord.js");
const config = require("../config");
const {Loader} = require("./lib/loader")
const Manga = require("./lib/MangaDatabases/kitsu")


const Indt = new Discord.IntentsBitField()
Indt.add(Discord.IntentsBitField.Flags.GuildMessages,Discord.IntentsBitField.Flags.GuildPresences, Discord.IntentsBitField.Flags.GuildMembers,Discord.IntentsBitField.Flags.Guilds,Discord.IntentsBitField.Flags.MessageContent);
config.client.intents = Indt
const Client = new Discord.Client(config.client);

Client.login(process.env.TOKEN);

new Loader(Client)


Client.on("updatePrecense", async () => {

    //console.log(channel)
    const channel = Client.channels.cache.get("1041174919490310164")
    const msg = await channel.messages.fetch("1041176477464543303")
    msg.edit(`\`\`\`diff\n+ Kitsu\n+ ${global.ResponseTime.Kitsu || 0}ms\`\`\``)
    console.log(global.ResponseTime)
    let random = Math.floor(Math.random() * (2 + 2))
    switch (random) {
        case 0:
            const PKGCount = await Manga.FetchPackages()
            Client.user.setPresence({ activities: [{ name: `${PKGCount} mangas!`, type: Discord.ActivityType.Watching}] });
            break;
        case 1:
            let randomName = await Manga.GetRandomMangaName()
            Client.user.setPresence({ activities: [{ name: `${randomName}`, type: Discord.ActivityType.Watching}] });
            break;
        case 2:
            let randomName2 = await Manga.GetRandomMangaName()
            Client.user.setPresence({ activities: [{ name: `with my copy of ${randomName2}`, type: Discord.ActivityType.Playing}] });
            break;  
        default:
            break;
    }
});


module.exports = Client;

