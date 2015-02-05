module.exports = {
    environment : "development",
    database : {
//        engine : "mysql",
        engine : "sqlite",
        params : {
            mysql : {
                host : "localhost",
                port : "3306",
                user : "root",
                password : "",
                dbname : "myean",
                prefix : ""
            },
            sqlite : {
                path : "../database/myean_sqlite.db",
                prefix : ""
            }
        }
    }
};
