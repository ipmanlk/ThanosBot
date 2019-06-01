const Permission = require("../../controllers/permission");
const Config = require("./thanos.json");
const Plugins = require("../../controllers/plugins").getPlugins();


const handle = (client, msg) => {
    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    // check mute role exists
    handleThanos(msg);
};

const handleThanos = (msg) => {
    sendThanosInfo(msg);
};

const getPluginData = () => {
    // count total num of plugins in each cat
    let totalManualPlugins = Plugins.manual.length;
    let totalAutoPlugins = 0;

    for (let event in Plugins.auto) {
        totalAutoPlugins += Plugins.auto[event].length;
    }

    let totalDisabledPlugins = Plugins.disabled.length;
    let totalEnabledPlugins = totalManualPlugins + totalAutoPlugins;

    return {
        "totPlugins": totalEnabledPlugins + totalDisabledPlugins,
        "totManual": totalManualPlugins,
        "totAuto": totalAutoPlugins,
        "totDisabled": totalDisabledPlugins,
        "totEnabled": totalEnabledPlugins
    };
};

const getEmbed = () => {
    const data = getPluginData();
    return {
        color: 0x0099ff,
        title: "__**Thanos : Multipurpose Discord Bot**__",
        description: "*You’re strong. But I could snap my fingers, and you’d all cease to exist.*",
        thumbnail: {
            url: "https://i.imgur.com/Z6AWkwT.jpg",
        },
        fields: [
            {
                name: "**Plugin Info**",
                value: `**Total Plugins: ${data.totPlugins}**
                **Total Enabled Plugins: ${data.totEnabled}**
                **Total Disabled Plugins: ${data.totDisabled}**
                **Total Manual Plugins: ${data.totManual}**,
                **Total Auto Plugins: ${data.totAuto}**
                `
            }
        ]
    };
};

const sendThanosInfo = (msg) => {
    const embed = getEmbed();
    msg.channel.send({ embed });
};

module.exports = {
    handle
};
