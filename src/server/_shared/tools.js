var config = require("./config");

module.exports.log = function (value) {
    //ToDo: Use config to write to console, file or both.
    console.log(value);
}

module.exports.sendError = function (err, res) {
    if(err) console.log(err);
    if(res )res.status(500).send(err);
}
