/* fetches manga stuff */

const axios = require("axios")

const {sqlite} = require("../DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});

async function LookupMangaByName(Name) {
    try {
        const TimeStart = Date.now()
        const MangaLookup = await axios.get(`https://api.jikan.moe/v4/manga?order_by=popularity&sort=asc&q=${Name}&min_score=0.1c`)
        await ResponseTime.set("Jikan",Date.now() - TimeStart)
        if (MangaLookup.data) {
            if (MangaLookup.data.pagination.items.count == 0  || MangaLookup.data.data.length == 0) {
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

function CreateEmbeds(mangaData) {
    let Embeds = [];

    for (index in mangaData) {


        let Data = mangaData[index]
        let title = "I couldnt get a title!";
        if (Data.titles[0]) {
            title = Data.titles[0].title
        } else {
            const keys = Object.keys(Data.titles)
            let rtitle = keys[Math.floor(keys.length*Math.random())]
            title =  Data.titles[rtitle].title
        }
        let Score = (Data.score) ? Data.score.toString() : "?"
        let Popularity = (Data.popularity) ? "#"+Data.popularity.toString() : "?"
        let Description = (Data.synopsis) ? Data.synopsis.substring(0,420) + "..." : "?"
        let WrittenBy = (Data.authors[0]) ? Data.authors[0].name : "?"
        let Volumes = (Data.volumes) ? Data.volumes.toString() : "?"
        let Chapters = (Data.chapters) ? Data.chapters.toString() : "?"
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(Description)
            .setURL(Data.url)
            .addFields({name:"Favorites",value:Data.favorites.toString() || "?",inline:true})
            .addFields({name:"Popularity rank",value:Popularity || "?",inline:true})
            .addFields({name:"Score",value:Score || "?",inline:true})
            .addFields({name:"** **",value:"** **",inline:false})
            .addFields({name:"Volumes / Chapters",value:Volumes + " / " + Chapters,inline:true})
            .addFields({name:"Written by",value:WrittenBy,inline:true})
            .addFields({name:"Status",value:Data.status,inline:true})
            .setFooter({text:"Using Jikan API | Bot by Dwifte <3",iconURL:"https://github.com/DwifteJB.png"})
            .setColor(Math.floor(Math.random()*16777215).toString(16))
            .setThumbnail(Data.images?.jpg?.image_url || null);
        Embeds.push(embed)
    }
    return Embeds
}

module.exports = {LookupMangaByName,CreateEmbeds}