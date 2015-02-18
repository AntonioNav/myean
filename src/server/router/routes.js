module.exports = function (app, express, passport, database) {
    app.use('/api', require('./routes/root.js')(express, passport, database));
    app.use('/api/priv', require('./routes/users.js')(express, database));
};