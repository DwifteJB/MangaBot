//  const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
//if (!matches) return;

require("dotenv").config();
const path = require("path");
global.rootFolder = path.resolve(__dirname);
module.exports = {
	config: require("./config.json"),
	Client: require("./src/client")
};