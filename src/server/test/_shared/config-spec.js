var config = require("../../_shared/config.js");
 
describe("Config module", function () {
    it("Environment data exist", function () {
        expect(config.environment).toBeDefined();
    });
    it("Database.name exist", function () {
        expect(config.database.dbname).toBeDefined();
    });
});