const tester = require("tester")
    , CompositionCRUD = require("../lib")
    , EnginePaths = require("engine-paths")
    ;

tester.describe("testing the CRUD operations", test => {
    // Initialize CRUD
    var crud = new CompositionCRUD(
        new EnginePaths(`${__dirname}/demo-app`)
    );

    test.it("create instance", cb => {
        crud.create("layout", cb);
    });

    test.it("read instance", cb => {
        crud.read("layout", (err, data) => {
            test.expect(err).toBe(null);
            test.expect(data).toEqual({ name: "layout" });
            cb();
        });
    });

    test.it("update instance", cb => {
        crud.update("layout", { module: "test" }, cb);
    });

    test.it("read instance", cb => {
        crud.read("layout", (err, data) => {
            test.expect(err).toBe(null);
            test.expect(data).toEqual({ name: "layout", module: "test" });
            cb();
        });
    });

    test.it("list instances", cb => {
        crud.list((err, data) => {
            test.expect(err).toBe(null);
            test.expect(data).toEqual(["layout"]);
            cb();
        });
    });

    test.it("delete instance", cb => crud.remove("layout", cb));
});
