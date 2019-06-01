const parse = (str, data) => {
    try {
        let memberId = (data.member) ? data.member.id : data.id;
        let memberName = data.displayName || data.member.displayName;

        const keyValue = {
            "{server}": `${data.guild.name}`,
            "{@user}": `<@${memberId}>`,
            "{user}": `${memberName} `,
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