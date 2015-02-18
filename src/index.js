//Modules required
var express = require('express');
var bodyParser = require('body-parser');
var expLogger = require('express-logger');
var cookieParser = require('cookie-parser');
var expSession = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var util = require('util');

//Files required
var config = require('./server/_shared/config');
var tools = require('./server/_shared/tools');

var database = null;

if (config.database.engine == "mysql") {
    database = require('./server/model/mysql_database')(config.database.params.mysql);
} else {
    database = require('./server/model/sqlite_database')(config.database.params.sqlite);
}
 
//var users = require('./server/model/users')(database);

var mypass = require('./server/_shared/mypass')(database);

tools.log('ready');
//tools.log(JSON.stringify(config));

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
    tools.log('Test!!');
    res.send('Test ok!');
});

require('./server/router/routes')(app, express, mypass, database);

app.use(express.static(__dirname + '/client'));

tools.log('start');

server.listen(3000);
tools.log('go!');