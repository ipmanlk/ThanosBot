const DiscordJs = require("discord.js");
const Config = require("../settings/config.json");
let Plugins;
let client;

const init = () => {
    Plugins = (require("./plugins").getPlugins());
    client = new DiscordJs.Client();

    registerListeners();

    // login to client
    client.login(Config.BOT_TOKEN);
};

// event listeners 
const registerListeners = () => {
    client.on("guildMemberAdd", member => {
        Plugins.auto.guildMemberAdd.forEach(p => {
            const plugin = require(`../plugins/${p}/${p}`);
            plugin.handle(client, member);
        });
    });


    client.on("message", msg => {
        if (msg.content.startsWith(Config.BOT_PREFIX)) {
            handleManualCommand(msg);
        }

        // auto plugins
        Plugins.auto.message.forEach(p => {
            const plugin = require(`../plugins/${p}/${p}`);
            plugin.handle(client, msg);
        });
    });

    // when bot is ready
    client.on("ready", () => {
        // set status
        client.user.setActivity(`Watching ${client.guilds.size} servers | By ipmanlk@LKDevelopers🇱🇰`);
    });
};

// check plugin and run it's handle method
const handleManualCommand = (msg) => {
    const command = msg.content.split(Config.BOT_PREFIX)[1].split(" ")[0].trim();

    if (Plugins.manual.indexOf(command) > -1) {
        const plugin = require(`../plugins/${command}/${command}`);
        plugin.handle(client, msg);
    }
};

// destory and restart current bot
const reloadBot = () => {
    try {
        client.destroy().then(client.login(Config.BOT_TOKEN));
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    init,
    reloadBot
};