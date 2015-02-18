module.exports = function database (config) {

    var users = null;

    if (config.database.engine == "mysql") {
        users = require('./mysql/users')(config.database.params.mysql);
    } else {
        users = require('./sqlite/users')(config.database.params.sqlite);
    }

    return {
        getUserById: users.getUserById,
        getUserByEmail: users.getUserByEmail,
        getUserRoles: users.getUserRoles,
        getAllUsers: users.getAllUsers,
        newUser: users.newUser,
        updateUser: users.updateUser,
        deleteUserById: users.deleteUserById,
        getStoredPass: users.getStoredPass
    };
};