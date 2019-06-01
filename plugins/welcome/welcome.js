const Config = require("./welcome.json");
const Parser = require("../../libs/parser");

const handle = (client, member) => {
    sendWelcome(client, member);
};

const sendWelcome = (client, member) => {
    const channel = client.channels.find(channels => channels.name === Config.values.channel);
    channel.send(Parser.parse(Config.values.welcomeMsg, member));
};

module.exports = {
    handle
};