/* fetches manga stuff */

const axios = require("axios")
let cache = 69

const {sqlite} = require("../DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});

async function FetchPackages() {
    const TimeStart = Date.now();
    try {
        const Fetch = await axios.get("https://kitsu.io/api/edge/anime")
        await ResponseTime.set("Kitsu",Date.now() - TimeStart)
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
            await ResponseTime.set("Kitsu",Date.now() - TimeStart)
            if (Anime.data) {
                const mangaData = Anime.data.data[0]
                const keys = Object.keys(mangaData.attributes.titles)
                const title = keys[Math.floor(keys.length*Math.random())]
                return mangaData.attributes.titles[title]
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
        const MangaLookup = await axios.get(`https://kitsu.io/api/edge/manga?filter[text]=${Name}`)
        await ResponseTime.set("Kitsu",Date.now() - TimeStart)
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

const {EmbedBuilder} = require("discord.js")

function CreateEmbeds(MangaData) {
    let Embeds = [];

    for (index in MangaData) {
        let Data = MangaData[index]
        let title = "I couldnt get a title!";
        if (Data.attributes.titles?.en) {
            title = Data.attributes.titles.en
        } else {
            const keys = Object.keys(Data.attributes.titles)
            let rtitle = keys[Math.floor(keys.length*Math.random())]
            title =  Data.attributes.titles[rtitle]
        }
        let PopRank = (Data.attributes.popularityRank) ? Data.attributes.popularityRank.toString() : "?"
        let RatingRank = (Data.attributes.ratingRank) ? Data.attributes.ratingRank.toString() : "?"
        let Favorites = (Data.attributes.favoritesCount) ? Data.attributes.favoritesCount.toString() : "?"
        let Volumes = (Data.attributes.volumeCount) ? Data.attributes.volumeCount.toString() : "?"
        let Chapters = (Data.attributes.chapterCount) ? Data.attributes.chapterCount.toString() : "?"
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(Data.attributes.description.substring(0,420) + "..." )
            .setURL("https://kitsu.io/manga/" + Data.id)
            .addFields({name:"Favourites",value:Favorites,inline:true})
            .addFields({name:"Popularity Rank",value:PopRank,inline:true})
            .addFields({name:"RatingRank",value:RatingRank,inline:true})
            .addFields({name:"** **",value:"** **",inline:false})
            .addFields({name:"Volumes / Chapters",value:Volumes + " / " + Chapters,inline:true})
            .addFields({name:"Age Rating",value:Data.attributes.ageRating || "?",inline:true})
            .addFields({name:"Status",value:Data.attributes.status,inline:true})
            .setFooter({text:"Using Kitsu API | Bot by Dwifte <3",iconURL:"https://github.com/DwifteJB.png"})
            .setColor(Math.floor(Math.random()*16777215).toString(16))
            .setThumbnail(Data.attributes.posterImage.original || null);
        Embeds.push(embed)
    }
    return Embeds
}

module.exports = {FetchPackages, GetRandomMangaName, LookupMangaByName,CreateEmbeds}