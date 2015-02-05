//Modules required
var express = require('express');
var bodyParser = require('body-parser');
var expLogger = require('express-logger');
var cookieParser = require('cookie-parser');
var expSession = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');

//Files required
var config = require('./server/_shared/config');
var util = require('./server/_shared/util');

var database = null;

if (config.database.engine == "mysql") {
    database = require('./server/model/mysql_database')(config.database.params.mysql);
} else {
    database = require('./server/model/sqlite_database')(config.database.params.sqlite);
}
 
var users = require('./server/model/users')(database);

var mypass = require('./server/_shared/mypass')(users);
var routes = require('./server/_shared/routes')(express, mypass, util, users);

util.log('ready');
util.log(JSON.stringify(config));


users.listUsers(function (err, rows) {
    if (err) {
        util.log("Error");
        util.log(err);
    } else {
        util.log("User List: ");
        util.log(rows);
    };
});

users.getUser(null, 'admin@admin.new', function (err, rows) {
    if (err) {
        util.log("Error");
        util.log(err);
    } else {
        if (rows) {
            util.log("Default admin data: ");
            util.log(rows);
        } else {
            util.log("No data for default admin");
        }
    };
});

var app = express();
var server = require("http").Server(app);

app.use(expLogger({path: './debug.log'}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(expSession({ secret: 'ñlkjkñkljasdfasdñkjasdfasrwe',
                     saveUninitialized: true,
                     resave: true
//                     ,cookie: { maxAge: 60000 }  //Time in milliseconds
                   }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(flash());
app.use(mypass.initialize());
app.use(mypass.session());

app.get('/test', function (req, res) {
    util.log('Test!!');
    res.send('Test ok!');
});

app.use('/', routes);

app.use(express.static(__dirname + '/client'));

util.log('start');

server.listen(3000);
util.log('go!');