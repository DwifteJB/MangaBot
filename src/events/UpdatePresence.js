const Manga = require("../lib/MangaDatabases/kitsu")
const Discord = require("discord.js")
module.exports = async client => {
    let random = Math.floor(Math.random() * 4)
    console.log(random)
    let toDisplay
    switch (random) {
        case 0:
            toDisplay = await Manga.FetchPackages()
            client.user.setPresence({ activities: [{ name: `${toDisplay} mangas!`, type: Discord.ActivityType.Watching}] });
            break;
        case 1:
            toDisplay = await Manga.GetRandomMangaName()
            client.user.setPresence({ activities: [{ name: `${toDisplay}`, type: Discord.ActivityType.Watching}] });
            break;
        case 2:
            toDisplay = await Manga.GetRandomMangaName()
            client.user.setPresence({ activities: [{ name: `with my copy of ${toDisplay}`, type: Discord.ActivityType.Playing}] });
            break;  
        case 3:
            toDisplay = await Manga.GetRandomMangaName()
            client.user.setPresence({ activities: [{ name: `the adaptation of ${toDisplay}`, type: Discord.ActivityType.Watching}] });
            break;

        default:
            break;
    }
};