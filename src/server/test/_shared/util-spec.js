var util = require("../../_shared/util.js");
 
describe("Util module", function () {
    it("Log function exist", function () {
        expect(util.log).toBeDefined();
    });
    it("sendError function exist", function () {
        expect(util.sendError).toBeDefined();
    });
});