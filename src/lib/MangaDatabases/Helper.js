const path = require("path");
const requestsPerSecond = require(path.join(global.rootFolder)+"/config.json").requestsPerSecond
const Jikan = require("./jikan")
const Kitsu = require("./kitsu")
let requests = {}
async function GetEmbeds(Setting,Name) {
    // rate limiter!
    if (!requests[Setting]) requests[Setting] = 0
    if (requests[Setting] >= requestsPerSecond) {
        setTimeout(() => {GetEmbeds(Setting,Name)}, requestsPerSecond*100);
        return;
    }
    requests[Setting]+=1
    let Embeds
    switch (Setting) {
        case "Kitsu":
            const AnimeData = await Kitsu.LookupMangaByName(Name);
            if (AnimeData == false) {
                return false;
            }
            Embeds = Kitsu.CreateEmbeds(AnimeData)
            break;
        case "Jikan":
            const AData = await Jikan.LookupMangaByName(Name);
            if (AData == false) {
                return false;
            }
            Embeds = Jikan.CreateEmbeds(AData)
            break;
        default:
            return true
    }
    requests[Setting]-=1
    return Embeds;
}



module.exports = {GetEmbeds}