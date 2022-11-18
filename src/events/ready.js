const {SlashCommandLoader} = require(require("path").join(global.rootFolder,"src","lib") + "/loader.js")
module.exports = async client => {
  try {
    console.log(
      `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
    );
    // get package count
    new SlashCommandLoader(client).Load()

    client.emit("UpdatePresence")
    client.emit("updateResponseMessage")
    setInterval(() => {
      client.emit("updateResponseMessage")
    }, 30000);
    setInterval(() => {
      client.emit("UpdatePresence");
    },60000)
  } catch(err) {}
};