/*
        Loads anything the bot client needs.
*/
const path = require("path")
const fs = require("fs")
const Discord = require("discord.js")
const config = require(path.join(global.rootFolder,"config.json"));

class InteractionHandler {
    constructor(client,interaction) {
        this.client = client
        this.interaction = interaction
        this.command = this.client.commands.get(this.interaction.commandName)
        this.channel = this.interaction.guild.channels.cache.get(interaction.channelId)
    }
    async checkPermissions() {
        if (!this.command) return false;
        if (this.command.permissions) {
            this.message.permissions = await this.channel.permissionsFor(this.message.author);
            if (!authorPerms || !authorPerms.has(this.command.permissions)) {
                return false;
            }
            return true;
        }
        return true;
    }
}

// INTERACTIONHANDLER

class MessageHandler {
    constructor(client,message) {
        this.client = client
        this.message = message
        this.command = null

    }
    getCommand() {
        if (!this.message.content) return {command:null, arguments:null};

        if (this.message.guild) {
            // heres where we would have our prefix check, but as MongoDB hasn't been setup yet, ill just default it to g!
            // - DwifteJB
            this.message.prefix = config.prefix;
        } else message.prefix = config.prefix;
    
        if (!this.message.content.startsWith(this.message.prefix)) return {command:null, arguments:null}; //if theres no prefix at the start, return null
    
        const args = this.message.content.slice(this.message.prefix.length).trim().split(/ +/); // get arguments
        const command = args.shift().toLowerCase(); // command name
        this.command = command
        return {command: command, arguments: args}
    }
    getAliases() {
        if (!this.command) return null;
        let found = null;
        for (var command in this.client.commands) {
            if (this.client.commands.get(command).aliases.include(this.command)) {
                found=command;
                break;
            }
        }
        return found;
    }
    async checkPermissions() {
        if (!this.command) return false;
        if (this.command.permissions) {
            this.message.permissions = await this.message.channel.permissionsFor(this.message.author);
            if (!authorPerms || !authorPerms.has(this.command.permissions)) {
                return false;
            }
            return true;
        }
        return true;
    }
}

//

class Loader {
    constructor(client) {
        this.client = client

        this.client.commands = new Discord.Collection();
        const folder = fs.readdirSync(path.join(global.rootFolder,"src","commands")).filter(file => file.endsWith('.js'));
        console.clear()
        console.log("Loading commands!")
        console.log("╭────────────────────┬──╮");

        for (const file of folder) {
            try {
                const command = require(path.join(global.rootFolder,"src","commands",file));
                const boxCmdName = `${command.name}`.padEnd(20);
                console.log(`│${boxCmdName}│✅│`);
                console.log('├────────────────────┼──┤');
                this.client.commands.set(command.name, command);
            } catch (error) {
                const boxCmdName = `${file}`.padEnd(20);
                console.log(`│${boxCmdName}│❌│`);
                console.log(error)
            }
        }
        console.log('╰────────────────────┴──╯');
        
        fs.readdir(path.join(global.rootFolder,"src","events"), (err, files) => {
            if (err) return console.error;
            for (const file of files) {
              if (!file.endsWith(".js")) return;
              const evt = require(path.join(global.rootFolder,"src","events",file));
              let evtName = file.split(".")[0];
              client.on(evtName, evt.bind(null, client));
            };
            console.log(`Loaded ${files.length} events`)
          })

    }
}

class SlashCommandLoader {
    constructor(client) {
        this.client = client
        this.rest = new Discord.REST({ version: '10' }).setToken(this.client.token);
        this.commands = []
        const folder = fs.readdirSync(path.join(global.rootFolder,"src","commands")).filter(file => file.endsWith('.js'));
        for (const file of folder) {
            const command = require(path.join(global.rootFolder,"src","commands",file));
            if (command.slashCommandData) {
                this.commands.push(command.slashCommandData.toJSON());
            }

        }

    }
    async Load() {
        try {
            const data = await this.rest.put(
                Discord.Routes.applicationCommands(this.client.user.id),
                { body: this.commands },
            );
    
            console.log(`Loaded ${data.length} slash commands`);
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = {Loader, MessageHandler, SlashCommandLoader,InteractionHandler}