const {EmbedBuilder} = require("discord.js")

function CreateEmbeds(AnimeData) {
    let Embeds = [];

    for (index in AnimeData) {
        let Data = AnimeData[index]
        let title = "I couldnt get a title!";
        if (Data.attributes.titles?.en) {
            title = Data.attributes.titles.en
        } else {
            const keys = Object.keys(Data.attributes.titles)
            let rtitle = keys[Math.floor(keys.length*Math.random())]
            title =  Data.attributes.titles[rtitle]
        }
        let RatingRank = (Data.attributes.ratingRank) ? Data.attributes.ratingRank.toString() : "Not Found"
        let PopRank = (Data.attributes.popularityRank) ? Data.attributes.popularityRank.toString() : "Not Found"
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(Data.attributes.description.substring(0,420) + "..." )
            .setURL("https://kitsu.io/anime/" + Data.id)
            .addFields({name:"Rating Rank",value:RatingRank || "Has none",inline:true})
            .addFields({name:"Popularity Rank",value:PopRank || "Has none",inline:true})
            .addFields({name:"Average Rating",value:Data.attributes.averageRating || "Has none",inline:true})
            .addFields({name:"** **",value:"** **",inline:false})
            .addFields({name:"Favorites",value:Data.attributes.favoritesCount.toString(),inline:true})
            .addFields({name:"Age Rating",value:Data.attributes.ageRating + " " + Data.attributes.ageRatingGuide,inline:true})
            .addFields({name:"Status",value:Data.attributes.status,inline:true})
            .setFooter({text:"Bot by Dwifte <3",iconURL:"https://github.com/DwifteJB.png"})
            .setColor(13032420)
            .setThumbnail(Data.attributes.posterImage.original || null);
        Embeds.push(embed)
    }
    return Embeds
}


module.exports = {CreateEmbeds}