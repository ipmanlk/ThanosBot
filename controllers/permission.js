const check = (msg, allowed=[], disallowed=[]) => {
    // get all roles
    let memberRoles = msg.member.roles;

    // check member has at least one allowed role
    let roleAllowed = allowed.some(role => memberRoles.some(r => r.name === role)); 
    // check member has at least one disallowed role
    let roleDisallowed = disallowed.some(role => memberRoles.some(r => r.name === role));
    
    // return if member has perms
    return (roleAllowed && !roleDisallowed);
};

module.exports = {
    check
};