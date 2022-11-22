const {sqlite} = require("../lib/DatabaseHelper");
const Keyv = require('keyv');
const ResponseTime = new Keyv(sqlite, {
    namespace: 'ResponseTimes'
});
module.exports = async client => {
  const channel = client.channels.cache.get("1041174919490310164")
  const msg = await channel.messages.fetch("1041176477464543303")
  let Kitsu = await ResponseTime.get("Kitsu")
  let Jikan = await ResponseTime.get("Jikan")
  msg.edit(`\nLast updated: <t:${Math.floor(Date.now() / 1000)}:R>\n\`\`\`diff\n- Kitsu\n+ ${Kitsu || 0}ms\n\n- Jikan\n+ ${Jikan || 0}ms\`\`\``)

};