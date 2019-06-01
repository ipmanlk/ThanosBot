const Permission = require("../../controllers/permission");
const Config = require("./mute.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;
const Fs = require("fs");
const { resolve } = require("path");

const handle = (client, msg) => {

    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    // check mute role exists
    if (!getRole(msg, "Mute")) {
        createRole(client, msg);
    } else {
        handleMute(client, msg);
    }
};

// handle mute event
const handleMute = (client, msg) => {

    const mention = msg.content.split(`${Prefix}mute`)[1].split(" ")[1] || false;
    const time = msg.content.split(`${Prefix}mute`)[1].split(" ")[2] || false;

    // check metion exists
    if (mention) {

        // get user
        const user = getUserFromMention(client, mention.trim());
        const member = msg.guild.member(user);

        // if member is not false
        if (member) {
            // check this is a timed mute
            if (time) {
                muteTemp(member, msg, time);
            } else {
                mute(member, msg);
            }
        }
    } else {
        sendHelp(msg);
    }
};

// mute permenently
const mute = (member, msg) => {
    member.addRole(getRole(msg, "Mute"))
        .then(() => {
            msg.channel.send(`<@${member.id}> has been muted!`);
        })
        .catch((err) => {
            console.log(err);
        });
};

// temporary mute based on time
const muteTemp = (member, msg, time) => {
    member.addRole(getRole(msg, "Mute"))
        .then(() => {
            msg.channel.send(`<@${member.id}> has been muted for ${time}m!.`);

            // timeout to unmute
            setTimeout(() => {
                member.removeRole(getRole(msg, "Mute"))
                    .then(() => {
                        msg.channel.send(`<@${member.id}> has been unmuted automatically!.`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });

            }, (60000 * time));
        })
        .catch((err) => {
            console.log(err);
        });
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

// find role from a given string
const getRole = (msg, roleName) => {
    return msg.guild.roles.find(x => x.name === roleName);
};

// create mute role 
const createRole = (client, msg) => {
    msg.guild.createRole({
        name: "Mute",
    }).then(role => {
        console.log(`Created new role with name ${role.name} and color ${role.color}`);
        // upgrade permissions for each channel to mute role
        msg.guild.channels.forEach(channel => {
            channel.overwritePermissions(role, {
                SEND_MESSAGES: false,
                SPEAK: false
            })
                .then(() => console.log("Role permission updated"))
                .catch(console.error);
        });

        // then run handle mute
        handleMute(client, msg);

    }).catch(console.erssror);
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