const Config = require("./banOnJoin.json");
const { resolve } = require("path");
const Parser = require("../../libs/parser");

const handle = (client, member) => {
    if (checkName(member.displayName)) {
        const channel = client.channels.find(channels => channels.name === Config.values.channel);
        channel.send(Parser.parse(Config.values.banMsg, member));
        member.ban();
    }
};

// check member name maches any illigal chars
const checkName = (memberName) => {
    let regexes = readRegexes();

    for (let i = 0; i < regexes.length; i++) {
        const regex = new RegExp(regexes[i]);
        if (regex.test(memberName.trim())) {
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