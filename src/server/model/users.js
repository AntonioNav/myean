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

    function updateUser(id, name, email, sendmail, password, oldpass, isadmin, cb) {
        var allowChangePass = true;
        
        if (password) {
            if (oldpass) {
                database.getStoredPass(email, function (err, hash) {
                    if (err) {
                        cb(err, null);
                    } else {
                        allowChangePass = bcrypt.compareSync(oldpass, hash);

                        if (password && allowChangePass) {
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
                            cb('Password not match', null);
                        };
                    };
                });
            } else {
                if (isadmin) {
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
                    cb('Not allowed to change password', null);
                };
            };
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
        //Don't delete admin
        if (id == 1) {
            cb('Admin user cannot be delete.', null);
        } else {
            database.deleteUserById(id, cb);
        }
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
