var mysql = require('mysql');
module.exports = function database (config) {
    
    function getAllUsers(cb) {
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();

        var queryString = 'SELECT Id, Name, Email, SendMail FROM `' + config.prefix + 'Users` ORDER BY Id';

        connection.query(queryString, function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
                return cb(null, rows);
            };
        });
    };
    
    function newUser(name, email, hash, cb) {
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();
        
        connection.beginTransaction(function (err) {
            
            if (err) {
                return cb(err, null);
            } else {
                var valuesUser = {
                    Name: name,
                    Email: email,
                    Password: hash
                };
                
                var insertUser = 'INSERT INTO `' + config.prefix + 'Users` SET ?';
                
                connection.query(insertUser, valuesUser, function (err, result) {
                    if (err) {
                        connection.rollback();
                        return cb(err, null);
                    } else {
                        //Set default role to view
                        var userId = result.insertId;
                        var valueRole = {
                            Users_Id: userId,
                            Roles_Id: 2
                        };
                        var assignRole = 'INSERT INTO `' + config.prefix + 'Users_has_Roles` SET ?';
                        
                        connection.query(assignRole, valueRole, function (err, result) {
                            if (err) {
                                connection.rollback();
                                return cb(err, null);
                            } else {
                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback();
                                        return cb(err, null);
                                    }
                                    connection.end();
                                    return cb(null, userId);
                                });
                            };
                        });
                    };
                });
            }
        }); //transaction
    };
    
    function updateUser(id, name, email, sendmail, hash, cb) {
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();
        
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
        
        connection.query(queryString, queryData, function (err, result) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
                return cb(null, result.changedRows);
            };
        });
    };
    
    function getStoredPass(email, cb){
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();
              
        var queryString = 'SELECT Password FROM `' + config.prefix + 'Users` WHERE Email = ?';
        
        connection.query(queryString, [email], function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
                if (rows.length === 0) {
                    return cb(null, '');
                } else {
                    return cb(null, rows[0].Password);
                };
            };
        });
    };

    function getUserById(id, cb){
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();
              
        var queryString = 'SELECT Id, Name, Email FROM `' + config.prefix + 'Users` WHERE Id = ?';
        
        connection.query(queryString, [id], function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
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
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();
              
        var queryString = 'SELECT Id, Name, Email FROM `' + config.prefix + 'Users` WHERE Email = ?';
        
        connection.query(queryString, [email], function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
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
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
        
        connection.connect();

        var queryString = 'SELECT t1.Roles_Id as Id, t2.Name FROM `' + config.prefix + 'Users_has_Roles` t1, `' + config.prefix + 'Roles` t2  WHERE t1.Roles_Id = t2.Id and t1.Users_Id = ?';
        
        connection.query(queryString, [id], function (err, rows) {
            if (err) {
                return cb(err, null);
            } else {
                connection.end();
                return cb(null, rows);
            };
        });
    };

    function deleteUserById(id, cb) {
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.dbname
        });
                
        connection.connect();
        
        connection.beginTransaction(function (err) {
            
            if (err) {
                return cb(err, null);
            } else {
                var valuesUserRoles = {
                    Users_Id: id
                };
                
                var deleteUserRoles = 'DELETE FROM `' + config.prefix + 'Users_has_Roles` WHERE ? AND Users_Id <> 10';
                
                connection.query(deleteUserRoles, valuesUserRoles, function (err, result) {
                    if (err) {
                        connection.rollback();
                        return cb(err, null);
                    } else {
                        var valuesUser = {
                            Id: id
                        };
                        
                        var deleteUser = 'DELETE FROM `' + config.prefix + 'Users`  WHERE ? AND Name <> "admin"';
                        
                        connection.query(deleteUser, valuesUser, function (err, result) {
                            if (err) {
                                connection.rollback();
                                return cb(err, null);
                            } else {
                                connection.commit(function (err) {
                                    if (err) {
                                        connection.rollback();
                                        return cb(err, null);
                                    }
                                    connection.end();
                                    return cb(null, result.affectedRows);
                                });
                            };
                        });
                    };
                });
            }
        }); //transaction
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