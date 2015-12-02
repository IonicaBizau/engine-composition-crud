const wJson = require("w-json")
    , rJson = require("r-json")
    , fs = require("fs")
    , isThere = require("is-there")
    , errors = require("engine-comp-crud-errors")
    ;


class CompositionCRUD {
    constructor (paths) {
        this.paths = paths;
    }
    exists (name, cb) {
        return isThere(this.paths.instance(name), cb);
    }
    create (name, data, cb) {
        if (typeof data === "function") {
            cb = data;
            data = {};
        }
        this.exists(name, exists => {
            if (exists) {
                return cb(errors.INSTANCE_EXISTS_ALREADY(name));
            }
            data.name = name;
            wJson(this.paths.instance(name), data, cb);
        })
    }
    read (name, cb) {
        rJson(this.paths.instance(name), (err, data) => {
            if (err) {
                if (err.code === "ENOENT") {
                    err = errors.INSTANCE_DOES_NOT_EXIST(name);
                }
                return cb(err);
            }
            cb(null, data);
        });
    }
    update (name, data, cb) {
        this.exists(name, exists => {
            if (!exists) {
                return cb(errors.INSTANCE_DOES_NOT_EXIST(name));
            }
            data.name = name;
            wJson(this.paths.instance(name), data, cb);
        });
    }
    remove (name, cb) {
        this.exists(name, exists => {
            if (!exists) {
                return cb(errors.INSTANCE_DOES_NOT_EXIST(name));
            }
            fs.unlink(this.paths.instance(name), cb);
        });
    }
}
