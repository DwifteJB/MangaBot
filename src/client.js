/*
    Grookey: Main client script
*/
const Discord = require("discord.js");
const config = require("../config");
const {Loader} = require("./lib/loader")
const Manga = require("./lib/MangaDatabases/kitsu")
const {sqlite} = require("./lib/DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});


const Indt = new Discord.IntentsBitField()
Indt.add(Discord.IntentsBitField.Flags.GuildMessages,Discord.IntentsBitField.Flags.GuildPresences, Discord.IntentsBitField.Flags.GuildMembers,Discord.IntentsBitField.Flags.Guilds,Discord.IntentsBitField.Flags.MessageContent);
config.client.intents = Indt
const Client = new Discord.Client(config.client);

Client.login(process.env.TOKEN);

new Loader(Client)

Client.on("updateResponseMessage", async () => {
    const channel = Client.channels.cache.get("1041174919490310164")
    const msg = await channel.messages.fetch("1041176477464543303")
    let Kitsu = await ResponseTime.get("Kitsu")
    let Jikan = await ResponseTime.get("Jikan")
    msg.edit(`\nLast updated: <t:${Math.floor(Date.now() / 1000)}:R>\n\`\`\`diff\n- Kitsu\n+ ${Kitsu || 0}ms\n\n- Jikan\n+ ${Jikan || 0}ms\`\`\``)
})

Client.on("UpdatePresence", async () => {
    let random = Math.floor(Math.random() * (3+3))
    let toDisplay
    switch (random) {
        case 0:
            toDisplay = await Manga.FetchPackages()
            Client.user.setPresence({ activities: [{ name: `${toDisplay} mangas!`, type: Discord.ActivityType.Watching}] });
            break;
        case 1:
            toDisplay = await Manga.GetRandomMangaName()
            Client.user.setPresence({ activities: [{ name: `${toDisplay}`, type: Discord.ActivityType.Watching}] });
            break;
        case 2:
            toDisplay = await Manga.GetRandomMangaName()
            Client.user.setPresence({ activities: [{ name: `with my copy of ${toDisplay}`, type: Discord.ActivityType.Playing}] });
            break;  
        case 3:
            toDisplay = await Manga.GetRandomMangaName()
            Client.user.setPresence({ activities: [{ name: `the adaptation of ${toDisplay}`, type: Discord.ActivityType.Watching}] });
            break;

        default:
            break;
    }
});


module.exports = Client;

