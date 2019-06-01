const parse = (str, data) => {
    try {
        const keyValue = {
            "{server}": `${data.guild.name}`,
            "{@user}": `<@${data.id}>`,
            "{user}": `${data.displayName}`,
        };

        let parsedText = str;

        for (let key in keyValue) {
            parsedText = parsedText.replace(key, keyValue[key]);
        }

        return parsedText;

    } catch (err) {
        return false;
    }
};


module.exports = {
    parse
};