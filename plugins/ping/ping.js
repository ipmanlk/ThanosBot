const Permission = require("../../controllers/permission");
const Config = require("./ping.json");
const Prefix = require("../../settings/config.json").BOT_PREFIX;

const handle = (client, msg) => {

    // check perms
    if (!Permission.check(msg, Config.roles.allowed, Config.roles.disallowed)) {
        return;
    }

    msg.reply("pong");
};


module.exports = {
    handle
};