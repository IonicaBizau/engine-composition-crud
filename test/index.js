const tester = require("tester")
    , CompositionCRUD = require("../lib")
    , EnginePaths = require("engine-paths")
    ;

tester.describe("testing the CRUD operations", test => {
    // Initialize CRUD
    var crud = new CompositionCRUD(
        new EnginePaths(`${__dirname}/demo-app`)
    );
});
