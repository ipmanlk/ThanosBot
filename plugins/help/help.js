const Permission = require("../../controllers/permission");
const Config = require("./help.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;
const Plugins = require("../../controllers/plugins").getPlugins();
const { resolve } = require("path");

const handle = (client, msg) => {

    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    sendHelp(msg);
};

// handle mute event
const sendHelp = (msg) => {
    let embed = getHelpEmbed(msg);
    msg.channel.send({ embed: embed });
    msg.delete(1000);
};

// construct a help embed using plugin json files
const getHelpEmbed = () => {
    const embed = {
        color: 0x0099ff,
        title: "__**Thanos : Help for noobs**__",
        description: "*This is an auto generated help message. Please read the docs for full info.*",
        fields: [
            {
                name: "__**Bot Prefix**__",
                value: Prefix,
            },
            {
                name: "__**Manual Commands**__",
                value: `_Triggerd using ${Prefix} <command>_`,
            }
        ]
    };

    Plugins.manual.forEach(plugin => {
        const pConfig = require(resolve(`${__dirname}/../${plugin}/${plugin}.json`));
        embed.fields.push({
            name: plugin,
            value: `${pConfig.info.desc}`,
            inline: true
        });
    });

    embed.fields.push({
        name: "__**Auto Commands**__",
        value: `_Triggered automatically using events_`,
    });

    // add auto commands to embed
    for (let event in Plugins.auto) {
        Plugins.auto[event].forEach(plugin => {
            const pConfig = require(resolve(`${__dirname}/../${plugin}/${plugin}.json`));
            embed.fields.push({
                name: plugin,
                value: `${pConfig.info.desc}`,
                inline: true
            });
        });
    }

    return embed;
};

module.exports = {
    handle
};