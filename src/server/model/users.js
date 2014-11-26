var bcrypt = require('bcrypt-nodejs');

module.exports = function users(database) {
    
    function listUsers(cb) {
        database.getAllUsers(cb);
    };
    
    function newUser(name, email, password, cb) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, null, function (err, hash) {
                if (err) {
                    cb(err, null);
                } else {
                    database.newUser(name, email, hash, cb);
                };
            });
        });
    };

    function updateUser(id, name, email, sendmail, password, cb) {
        if (password) {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, null, function(err, hash) {
                    if (err) {
                        cb(err, null);
                    } else {
                        database.updateUser(id, name, email, sendmail, hash, cb);
                    };
                });
            });
        } else {
            database.updateUser(id, name, email, sendmail, null, cb);
        };
    };
    
    function checkPass(email, password, cb) {
        database.getStoredPass(email, function (err, hash) {
            if (err) {
                cb(err, null);
            } else {
                bcrypt.compare(password, hash, cb);
            };
        });
    };

    function getUser(id, email, cb) {
        
        if (id) {
            database.getUserById(id, cb);
        } else if (email) {
            database.getUserByEmail(email, cb);
        } else {
            cb('You need to provide id or email', null);
        };
    };

    function delUser(id, cb) {
        database.deleteUserById(id, cb);
    }

    
    return {
        listUsers: listUsers,
        newUser: newUser,
        updateUser: updateUser,
        getUser: getUser,
        delUser: delUser,
        checkPass: checkPass
    }
};
