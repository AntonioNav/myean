module.exports = function routes(express, database) {

    var router = express.Router();
    var users = require('../../model/users')(database);
    
    router.route('/users')
        .get(function (req, res, next) {
            var roles = req.user.roles;
            var isAdmin = false;

            roles.forEach(function (rol) {
                if (rol.Id === 1){
                    isAdmin = true;
                };
            });

            if (!isAdmin) {
                res.status(403).send('not authorized');
            } else {
                users.listUsers( function (err, rows) { 
                    if (err) {
                        res.status(500).send('Server error: ' + err);
                    } else {
                        res.json(rows);
                    }
                });
            };
        });
    
    router.route('/user')
        //Only Admin is allowed to add new user
        .all(function(req, res, next){
            var isAdmin = false;
        
            req.user.roles.forEach(function (rol, index) {
                if (rol.Id == 1) {
                    isAdmin = true;
                }
            });
        
            if (!isAdmin) {
                res.status(401).send("You are not allowed to do this!");
                return;
            } else {
                return next();
            }
    
        })
        //New users
        .post(function (req, res, next) {
            var name = req.body.Name;
            var email = req.body.Email;
            var password = req.body.Password;
            users.newUser(name, email, password, function(err, result){
                if (err) {
                    res.status(500).send('Insert error: ' + err);
                } else {
                    res.send('' + result);
                };
            });
        });

    router.route('/user/:id')
        //Only Admin or each user is allowed to list/edit/delete
        .all(function(req, res, next){
            var id = req.params.id;
            var isAdmin = false;
        
            req.user.roles.forEach(function (rol, index) {
                if (rol.Id == 1) {
                    isAdmin = true;
                }
            });
        
            if ((id != req.user.Id) && (!isAdmin)) {
                res.status(401).send("You are not allowed to do this!");
                return;
            } else {
                return next();
            }
    
        })
        .get(function (req, res, next) {
            var id = req.params.id;
        
            users.getUser(id, null, function (err, result) {
                if (err) {
                    res.status(500).send('User get error: ' + err);
                } else {
                    res.send('' + JSON.stringify(result));
                };
            });
        })
        .put(function (req, res, next) {
    
            var id = req.params.id;
            var name = req.body.Name;
            var email = req.body.Email;
            var sendmail = req.body.SendMail;
            var password = req.body.Password;
            var oldpass = req.body.OldPass;

            var isAdmin = false;
        
            req.user.roles.forEach(function (rol, index) {
                if (rol.Id == 1) {
                    isAdmin = true;
                }
            });
        
            users.updateUser(id, name, email, sendmail, password, oldpass, isAdmin, function(err, result){
                if (err) {
                    console.log('error: ' + err);
                    res.send('Update error: ' + err);
                } else {
                    res.send('' + result);
                };
            });
        })
        .delete(function (req, res, next) {
            var id = req.params.id;
            users.delUser(id, function(err, result){
                if (err) {
                    res.send(err);
                } else {
                    res.send('' + JSON.stringify(result));
                };
            });
        });

    return router;
}