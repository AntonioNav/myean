var sqlite = require('sqlite3');
module.exports = function users (config) {
    
    function getAllUsers(cb) {
        var db = new sqlite.Database(config.path);
        
        var queryString = 'SELECT Id, Name, Email, SendMail FROM `' + config.prefix + 'Users` ORDER BY Id';

        db.all(queryString, function (err, rows) {
            if (err) {
                db.close();
                return cb(err, null);
            } else {
                db.close();
                return cb(null, rows);
            };
        });
    };

    function newUser(name, email, hash, cb) {
        var db = new sqlite.Database(config.path);

        db.serialize(function() {

            db.run("BEGIN TRANSACTION");

            var valuesUser = {
                $Name: name,
                $Email: email,
                $Password: hash
            };

            var insertUser = 'INSERT INTO `' + config.prefix + 'Users` (Name, Email, Password) VALUES ($Name, $Email, $Password)';
            var queryString = 'SELECT Id, Name, Email, SendMail FROM `' + config.prefix + 'Users` WHERE Email = ?';
            var newUserId = null;

            db.run(insertUser, valuesUser, function (err){
                if (err) {
                    db.run("ROLLBACK");
                    db.close();
                    return cb(err, null);
                }
            });
            db.get(queryString,[valuesUser.$Email], function(err, row){
                if (err) {
                    db.run("ROLLBACK");
                    db.close();
                    return cb(err, null);
                } else {
                    newUserId = row.Id

                    var valueRole = {
                        $Users_Id: newUserId,
                        $Roles_Id: 2
                    };
                    var assignRole = 'INSERT INTO `' + config.prefix + 'Users_has_Roles` (Users_Id, Roles_Id) VALUES ($Users_Id, $Roles_Id)';

                    db.run(assignRole, valueRole, function(err){
                        if (err) {
                            db.run("ROLLBACK");
                            db.close();
                            return cb(err, null);
                        } else {
                            db.run("COMMIT");
                            db.close();
                            return cb(null, newUserId);
                        }
                    });
                }
            });
        });
    };


    function updateUser(id, name, email, sendmail, hash, cb) {
        var db = new sqlite.Database(config.path);
        
        var queryString, queryData;
        
        if (hash) {
            queryString = 'UPDATE `' + config.prefix + 'Users` ' 
                + 'SET Name = ?, Email = ?, SendMail = ?, Password = ? '
                + 'WHERE Id = ?';
            queryData = [name, email, sendmail, hash, id];
        } else {
            queryString = 'UPDATE `' + config.prefix + 'Users` ' 
                + 'SET Name = ?, Email = ?, SendMail = ? '
                + 'WHERE Id = ?';
            queryData = [name, email, sendmail, id];
        }
        
        db.run(queryString, queryData, function (err) {
            if (err) {
                db.close();
                return cb(err, null);
            } else {
                db.close();
                return cb(null, this.changes);
            };
        });
    };

    function getStoredPass(email, cb){
        var db = new sqlite.Database(config.path);
              
        var queryString = 'SELECT Password FROM `' + config.prefix + 'Users` WHERE Email = ?';
        
        db.all(queryString, [email], function (err, rows) {
            if (err) {
                db.close();
                return cb(err, null);
            } else {
                db.close();
                if (rows.length === 0) {
                    return cb(null, '');
                } else {
                    return cb(null, rows[0].Password);
                };
            };
        });
    };

    function getUserById(id, cb){
        var db = new sqlite.Database(config.path);
              
        var queryString = 'SELECT Id, Name, Email, SendMail FROM `' + config.prefix + 'Users` WHERE Id = ?';
        
        db.all(queryString, [id], function (err, rows) {
            if (err) {
                db.close();
                return cb(err, null);
            } else {
                db.close();
                if (rows.length > 0) {
                    getUserRoles(rows[0].Id, function (err, roles) {
                        if (err) { return cb(err, null)};
                        rows[0].roles = roles;
                        return cb(null, rows[0]);
                    });
                } else {
                    rows[0].roles = [];
                    return cb(null, rows[0]);
                };
            };
        });
    };

    function getUserByEmail(email, cb){
        var db = new sqlite.Database(config.path);
              
        var queryString = 'SELECT Id, Name, Email, SendMail FROM `' + config.prefix + 'Users` WHERE Email = ?';
        
        db.all(queryString, [email], function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                db.close();
                if (rows.length > 0) {
                    getUserRoles(rows[0].Id, function (err, roles) {
                        if (err) { return cb(err, null)};
                        rows[0].roles = roles;
                        return cb(null, rows[0]);
                    });
                } else {
                    return cb(null, rows[0]);
                }
            };
        });
    };

    function getUserRoles(id, cb){
        var db = new sqlite.Database(config.path);

        var queryString = 'SELECT t1.Roles_Id as Id, t2.Name FROM `' + config.prefix + 'Users_has_Roles` t1, `' + config.prefix + 'Roles` t2  WHERE t1.Roles_Id = t2.Id and t1.Users_Id = ?';
        
        db.all(queryString, [id], function (err, rows) {
            if (err) {
                db.close();
                return cb(err, null);
            } else {
                db.close();
                return cb(null, rows);
            };
        });
    };

    function deleteUserById(id, cb) {
        var db = new sqlite.Database(config.path);

        db.serialize(function() {
            
            db.run("BEGIN TRANSACTION");
            
            var deleteUserRoles = 'DELETE FROM `' + config.prefix + 'Users_has_Roles` WHERE Users_Id = ? AND Users_Id <> 10';

            db.run(deleteUserRoles, [id], function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    db.close();
                    return cb(err, null);
                } else {
                    var deleteUser = 'DELETE FROM `' + config.prefix + 'Users`  WHERE Id = ? AND Name <> "admin"';

                    db.run(deleteUser, [id], function (err) {
                        if (err) {
                            db.run("ROLLBACK");
                            db.close();
                            return cb(err, null);
                        } else {
                            db.run("COMMIT");
                            db.close();
                            return cb(null, this.changes);
                        };
                    });
                };
            });
        })
    };
    
    return {
        getUserById: getUserById,
        getUserByEmail: getUserByEmail,
        getUserRoles: getUserRoles,
        getAllUsers: getAllUsers,
        newUser: newUser,
        updateUser: updateUser,
        deleteUserById: deleteUserById,
        getStoredPass: getStoredPass
    };
};