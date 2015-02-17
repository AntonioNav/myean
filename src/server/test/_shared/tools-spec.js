var util = require("../../_shared/tools.js");
 
describe("Tools module", function () {
    it("Log function exist", function () {
        expect(util.log).toBeDefined();
    });
    it("sendError function exist", function () {
        expect(util.sendError).toBeDefined();
    });
});