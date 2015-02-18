module.exports = function mypass(database) {
    
    var users = require('../model/users')(database);

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    
    passport.serializeUser(function(user, done){
        done(null, user.Id);
    });
    
    passport.deserializeUser(function(id, done) {
        users.getUser(id, null, function (err, user) {
            done(err, user);
        });
    });
    
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            users.getUser(null, username, function(err, user) {
                
                if (err) { return done(err); }

                if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }

                users.checkPass(username, password, function(err, valid){
                    if (err) {
                        return done(null, false, {message: 'Invalid password'});
                    } else {
                        return done(null, user);
                    };
                });
            });
        })
    }));
    
    return passport;
    
};