const Config = require("./delOnMsg.json");
const { resolve } = require("path");
const Parser = require("../../libs/parser");

const handle = (client, msg) => {
    if (checkMsg(msg.content)) {
        const channel = client.channels.find(channels => channels.name === Config.values.channel);
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