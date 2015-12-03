const CompositionCRUD = require("../lib")
    , EnginePaths = require("engine-paths")
    ;

// Initialize CRUD
var crud = new CompositionCRUD(
    new EnginePaths("path/to/some/app")
);

// Create the layout instance
crud.create("layout", /* optional data, */ function (err, data) {
    console.log(err || data);
    // => { name: "layout" }
});

// Read the layout instance
crud.read("layout", function (err, data) {
    console.log(err || data);
    // => { name: "...", ...}
});

// Update the layout instance
crud.update("layout", { module: "some-module" }, function (err, data) {
    console.log(err || data);
    // => { name: "...", module: "some-module", ...}
});
