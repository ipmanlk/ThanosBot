const Config = require("./delOnMsg.json");
const { resolve } = require("path");
const Parser = require("../../libs/parser");
const Permission = require("../../controllers/permission");

const handle = (client, msg) => {
    // ignore if user is an admin
    if (Permission.checkAdmin(msg)) {
        return;
    }

    if (checkMsg(msg.content)) {
        let channel;
        if (Config.values.channel) {
            channel = client.channels.find(channels => channels.name === Config.values.channel);
        } else {
            channel = msg.channel;
        }
        channel.send(Parser.parse(Config.values.delMsg, msg));
        msg.delete();
    }
};

// check msg has any not allowed words
const checkMsg = (text) => {
    let regexes = readRegexes();

    for (let i = 0; i < regexes.length; i++) {
        const regex = new RegExp(regexes[i], "g");
        if (regex.test(text.trim())) {
            return true;
        }
    }
    return false;
};

// read regex from file
const readRegexes = () => {
    let fs = require("fs");
    let regexes = fs.readFileSync((resolve(`${__dirname}/data/regexes.txt`))).toString().split("\n");
    return regexes;
};


module.exports = {
    handle
};