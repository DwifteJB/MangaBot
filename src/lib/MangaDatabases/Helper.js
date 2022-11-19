const path = require("path");
const requestsPerSecond = require(path.join(global.rootFolder)+"/config.json").requestsPerSecond
const Jikan = require("./jikan")
const Kitsu = require("./kitsu")
let requests = {}

const {sqlite} = require("../DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});

async function GetEmbeds(Setting,Name) {
    // rate limiter!
    if (!requests[Setting]) requests[Setting] = 0
    if (requests[Setting] >= requestsPerSecond) {
        setTimeout(() => {GetEmbeds(Setting,Name)}, requestsPerSecond*100);
        return;
    }
    requests[Setting]+=1
    //const TimeStart = Date.now()
    let Embeds

    switch (Setting) {
        case "Kitsu":
            const mangaData = await Kitsu.LookupMangaByName(Name);
            if (mangaData == false) {
                return false;
            }
            Embeds = Kitsu.CreateEmbeds(mangaData)
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
    //await ResponseTime.set(Setting,Date.now() - TimeStart)
    requests[Setting]-=1
    return Embeds;
}



module.exports = {GetEmbeds}