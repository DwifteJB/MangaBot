const Jikan = require("./jikan")
const Kitsu = require("./kitsu")
async function GetEmbeds(Setting,Name) {
    let Embeds
    switch (Setting) {
        case "Kitsu":
            const AnimeData = await Kitsu.LookupMangaByName(Name);
            if (AnimeData == false) {
                return false;
            }
            Embeds = Kitsu.CreateEmbeds(AnimeData)
            return Embeds
        case "Jikan":
            const AData = await Jikan.LookupMangaByName(Name);
            if (AData == false) {
                return false;
            }
            Embeds = Jikan.CreateEmbeds(AData)
            return Embeds
        default:
            return true
    }
}
module.exports = {GetEmbeds}