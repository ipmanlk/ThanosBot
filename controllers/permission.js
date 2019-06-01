const check = (msg, allowed = [], disallowed = []) => {
    // get all roles
    let memberRoles = msg.member.roles;

    // check member has at least one allowed role
    let roleAllowed = true;
    if (allowed.length !== 0) {
        roleAllowed = allowed.some(role => memberRoles.some(r => r.name === role));
    }

    // check member has at least one disallowed role
    let roleDisallowed = false;
    if (disallowed !== 0) {
        roleDisallowed = disallowed.some(role => memberRoles.some(r => r.name === role));
    }

    // return if member has perms
    return (roleAllowed && !roleDisallowed);
};

module.exports = {
    check
};