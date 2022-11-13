const {SlashCommandLoader} = require("../lib/Loader")
module.exports = async client => {
  try {
    console.log(
      `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
    );
    // get package count
    new SlashCommandLoader(client).Load()

    client.emit("updatePrecense")
    setInterval(() => {
      client.emit("updatePrecense");

    },60000)
  } catch(err) {}
};