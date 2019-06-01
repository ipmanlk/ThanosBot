const Permission = require("../../controllers/permission");
const Config = require("./purge.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;
const Fs = require("fs");
const { resolve } = require("path");

const handle = (client, msg) => {
    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    // check mute role exists
    handlePurge(client, msg);
};

const handlePurge = (client, msg) => {
    // get num of msgs to delete
    const num = msg.content.split(`${Prefix}${Config.info.name}`)[1].split(" ")[1] || false;

    // check if num is present
    if (num) {
        if (num === "all") {
            purgeAll(msg);
        } else {
            purgeCustom(msg, num);
        }
    } else {
        sendHelp(msg);
    }
};

// purge all msgs
const purgeAll = async (msg) => {
    let fetched;
    do {
        fetched = await msg.channel.fetchMessages({ limit: 100 });
        msg.channel.bulkDelete(fetched);
    }
    while (fetched.size >= 2);
};

// purge msgs less than 100 (manual)
const purgeCustom = async (msg, num) => {
    if (num > 100) { return; }
    let limit = parseInt(num) + 1;
    let fetched = await msg.channel.fetchMessages({ limit: limit });
    msg.channel.bulkDelete(fetched);
};

// send help about purge msg
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
