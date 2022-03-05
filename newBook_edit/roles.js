/*const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")
 
ac.grant("admin")
 .extend("basic")
 .createAny("profile")
 .readAny("profile")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();*/

module.exports = {
    Admin: 'admin',
    Basic: 'basic',
};