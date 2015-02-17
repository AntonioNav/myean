module.exports = function routes(express, passport, users) {

    var router = express.Router();
    
    function ensureAuthenticated(req, res, next) {
    
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/#/login');
    };

    router.route('/api/priv/*')
        .all(ensureAuthenticated)
    
    router.route('/api/priv/test')
    //    .all(ensureAuthenticated)
        .get(function(req, res, next) {
            res.send('API-Priv Test Ok!');
            return next();
        });
    
    
    router.route('/api/test')
        .all(function (req, res, next) {
            res.send('API Test ok!');
            return next();
        });
    
    router.route('/api/loged')
        .all(function (req, res, next) {
            if (req.isAuthenticated()) { 
                res.send('true');
            } else {
                res.send('false');
            }
        });    
    
    router.route('/api/login')
        .post(function (req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.redirect('/#/login'); }
                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    res.set('user', user);
                    return res.send(user);
                });
            })(req, res, next);
        });
    
    router.route('/api/logout')
        .all(function(req, res){
            req.logout();
            res.clearCookie('connect.sid');
            res.clearCookie('userData');
            res.send('logout ok');
        });

    router.route('/api/menu')
        .get(function (req, res, next) {

            var roles = [];
            var options = [];
            var loged = false;
        
            if (req.user) {
                roles = req.user.roles;
                loged = true;
            };
        
            //Initial, shared options menu
            options.push({
                    text: 'Menu_Home',
                    path: '/#/',
                });
        
            if (!loged) {
                options.push({
                        text: 'Menu_Login',
                        path: '/#/login',
                    });                
            };

            //Middle, role options menu
            roles.forEach(function (rol, index) {
                switch (rol.Id) {
                //Admin
                case 1:
                    options.push({
                            text: 'Menu_List_Users',
                            path: '/#/users/list'
                    });
                    options.push({
                            text: 'Menu_Profile',
                            path: '/#/user'
                    });
                    break;
                //User
                case 2:
                    options.push({
                            text: 'Menu_Profile',
                            path: '/#/user'
                    });
                    break;
                //Other
                case 3:
                    options.push({
                            text: 'Menu_Other',
                            path: '/#/'
                    });
                    break;
                }

            });
        
            //End, another shared options menu
            if (loged) {
                options.push({
                        text: 'Menu_Logout',
                        path: '/#/logout'
                    });
            };

            res.json(options);
        });

    router.route('/api/priv/users')
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
    
    router.route('/api/priv/user')
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

    router.route('/api/priv/user/:id')
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
                    res.status(500).send('Delete error: ' + err);
                } else {
                    res.send('' + JSON.stringify(result));
                };
            });
        });

    return router;
}
