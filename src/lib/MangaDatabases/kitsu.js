/* fetches manga stuff */

const axios = require("axios")
let cache = 69
async function FetchPackages() {
    const TimeStart = Date.now();
    try {
        const Fetch = await axios.get("https://kitsu.io/api/edge/anime")
        global.ResponseTime.Kitsu = Date.now() - TimeStart
        if (Fetch.data) {
            cache = Fetch.data.meta.count
            return Fetch.data.meta.count
        } else {
            return 0
        }
        
    } catch(e) {
        return cache
    }

}

async function GetRandomMangaName() { 
    const TimeStart = Date.now()
    try {
   
        const Fetch = await axios.get("https://kitsu.io/api/edge/anime")
        if (Fetch.data) {
            const count = Fetch.data.meta.count
            const r = Math.floor(Math.random() * count)
            const Anime = await axios.get("https://kitsu.io/api/edge/anime?page[limit]=1&page[offset]="+r)
            global.ResponseTime.Kitsu = Date.now() - TimeStart
            if (Anime.data) {
                const AnimeData = Anime.data.data[0]
                const keys = Object.keys(AnimeData.attributes.titles)
                const title = keys[Math.floor(keys.length*Math.random())]
                return AnimeData.attributes.titles[title]
            } else {
                return "JoJo"
            }
        } else {
            return "JoJo's Bizzare Adventure"
        }

    } catch (e) {
        return "JoJo's Bizzare Adventure"
    }
 
}
async function LookupMangaByName(Name) {
    try {
        const TimeStart = Date.now()
        const MangaLookup = await axios.get(`https://kitsu.io/api/edge/anime?filter[text]=${Name}`)
        global.ResponseTime.Kitsu = Date.now() - TimeStart
        if (MangaLookup.data) {
            if (MangaLookup.data.meta.count == 0  || MangaLookup.data.data.length == 0) {
                return false
            } else {
                console.log("returning data")
                return MangaLookup.data.data
            }
    
        } else {
            return false;
        }
    } catch {
        return false
    }
}

module.exports = {FetchPackages, GetRandomMangaName, LookupMangaByName}