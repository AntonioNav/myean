module.exports = function routes(express, passport, database) {

    var router = express.Router();
    var users = require('../../model/users')(database);
    
    function ensureAuthenticated(req, res, next) {
    
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/#/login');
    };

    router.route('/priv/*')
        .all(ensureAuthenticated)
    
    router.route('/priv/test')
        .get(function(req, res, next) {
            res.send('API-Priv Test Ok!');
            return next();
        });
    
    
    router.route('/test')
        .all(function (req, res, next) {
            res.send('API Test ok!');
            return next();
        });
    
    router.route('/loged')
        .all(function (req, res, next) {
            if (req.isAuthenticated()) { 
                res.send('true');
            } else {
                res.send('false');
            }
        });    
    
    router.route('/login')
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
    
    router.route('/logout')
        .all(function(req, res){
            req.logout();
            res.clearCookie('connect.sid');
            res.clearCookie('userData');
            res.send('logout ok');
        });

    router.route('/menu')
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

    return router;
}