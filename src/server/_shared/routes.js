
module.exports = function routes(express, passport, util, users) {

    var router = express.Router();
    
    function ensureAuthenticated(req, res, next) {
    
        if (req.isAuthenticated()) { return next(); }
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
                    text: 'Home',
                    path: '/#/',
                });
        
            if (!loged) {
                options.push({
                        text: 'Login',
                        path: '/#/login',
                    });                
            };

            //Middle, role options menu
            roles.forEach(function (rol, index) {
                switch (rol.Id) {
                //Admin
                case 1:
                    options.push({
                            text: 'List Users',
                            path: '/#/users/list'
                    });
                    break;
                //User
                case 2:
                    options.push({
                            text: 'Profile',
                            path: '/#/'
                    });
                    break;
                //Other
                case 3:
                    options.push({
                            text: 'Other Options',
                            path: '/#/'
                    });
                    break;
                }

            });
        
            //End, another shared options menu
            if (loged) {
                options.push({
                        text: 'logout',
                        path: '/#/logout'
                    });
            };

            res.json(options);
        });

    router.route('/api/priv/users')
        .get(function (req, res, next) {
            var roles = req.user.roles;
            var authorized = false;

            roles.forEach(function (rol) {
                if (rol.Id === 1){
                    authorized = true;
                };
            });

            if (!authorized) {
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
        .get(function (req, res, next) {
            res.send('User ID is required!');
        })
        .put(function (req, res, next) {
            var id = req.body.Id;
            var name = req.body.Name;
            var email = req.body.Email;
            var sendmail = req.body.SendMail;
            var password = req.body.Password;
            users.updateUser(id, name, email, sendmail, password, function(err, result){
                if (err) {
                    res.status(500).send('Update error: ' + err);
                } else {
                    res.send('' + result);
                };
            });
        })
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
        .get(function (req, res, next) {
            var id = req.params.id;
            users.getUser(id, null, function (err, result) {
                if (err) {
                    res.status(500).send('User get error: ' + err);
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
                    res.send('' + result);
                };
            });
        });

    return router;
}
