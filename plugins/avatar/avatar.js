const Permission = require("../../controllers/permission");
const Config = require("./avatar.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;
const Fs = require("fs");
const { resolve } = require("path");

const handle = (client, msg) => {

    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    // send avatar
    sendAvatar(client, msg);
};

const sendAvatar = (client, msg) => {

    const mention = msg.content.split(`${Prefix}${Config.info.name}`)[1].split(" ")[1] || false;

    // check metion exists
    if (mention) {

        // get user
        const user = getUserFromMention(client, mention.trim());

        // make embed
        const embed = {
            author: {
                name: user.tag,
                icon_url: user.avatarURL,
                url: "",
            },
            title: "Avatar",
            image: {
                url: user.avatarURL
            }
        };

        // send embed
        msg.channel.send({ embed });

    } else {
        sendHelp(msg);
    }
};

// get discord user from a mentioned string
const getUserFromMention = (client, mention) => {
    if (mention.startsWith("<@") && mention.endsWith(">")) {
        mention = mention.slice(2, -1);

        if (mention.startsWith("!")) {
            mention = mention.slice(1);
        }

        return client.users.get(mention);
    }
};

// send help 
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