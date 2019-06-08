const Permission = require("../../controllers/permission");
const Config = require("./plugin.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;
const { resolve } = require("path");
const Fs = require("fs");

const handle = (client, msg) => {
    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    const plugin = msg.content.split(`${Prefix}${Config.info.name}`)[1].split(" ")[1] || false;
    const command = msg.content.split(`${Prefix}${Config.info.name}`)[1].split(" ")[2] || false;

    if (plugin && command) {
        let pluginConfigPath, pluginConfig;

        // try and load the plugin
        try {
            pluginConfigPath = resolve(`${__dirname}/../${plugin}/${plugin}.json`);
            pluginConfig = require(pluginConfigPath);

        } catch (error) {
            msg.reply("Unable to find that plugin!.");
        }

        // perform action on the plugin
        switch (command) {
            case "enable":
                enablePlugin(pluginConfigPath, pluginConfig);
                msg.reply(`Plugin: ${plugin} has been enabled!.`);
                break;
            case "disable":
                disablePlugin(pluginConfigPath, pluginConfig);
                msg.reply(`Plugin: ${plugin} has been disabled!.`);
                break;
            default:
                sendHelp(msg);
        }

    } else {
        sendHelp(msg);
    }

    // delete command
    msg.delete(1000);
};

const enablePlugin = (pluginConfigPath, pluginConfig) => {
    pluginConfig.info.enabled = true;
    writePluginConfig(pluginConfigPath, pluginConfig);
};

const disablePlugin = (pluginConfigPath, pluginConfig) => {
    pluginConfig.info.enabled = false;
    writePluginConfig(pluginConfigPath, pluginConfig);
};

const writePluginConfig = (pluginConfigPath, pluginConfig) => {
    Fs.writeFileSync(pluginConfigPath, JSON.stringify(pluginConfig), "utf8");
    const bot = require("../../controllers/bot");
    bot.reloadBot();
};

const sendHelp = (msg) => {
    const help = Fs.readFileSync(resolve(`${__dirname}/${Config.info.name}.help`), "utf-8");
    const embed = {
        fields: [
            {
                name: `**Command:** ${Prefix}${Config.info.name}`,
                value: `**Description**: ${Config.info.desc}
                **Sub Commands**
                ${help.replace(/<prefix>/g, Prefix)}`,
            }
        ]
    };
    msg.channel.send({ embed });
};

module.exports = {
    handle
};