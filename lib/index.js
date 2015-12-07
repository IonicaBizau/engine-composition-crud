"use strict";

const wJson = require("w-json")
    , rJson = require("r-json")
    , fs = require("fs")
    , isThere = require("is-there")
    , errors = require("engine-comp-crud-errors")
    , sameTime = require("same-time")
    , CompositionAdapter = require("engine-composition-adapter")
    ;

class CompositionCRUD extends CompositionAdapter {

    /**
     * CompositionCRUD
     * Creates a new instance of `CompositionCRUD`.
     *
     * @name constructor
     * @function
     * @param {EnginePaths} paths The `EnginePaths` instance.
     */
    constructor (paths) {
        super();
        this.paths = paths;
    }

    /**
     * exists
     * Checks if an instance exists.
     *
     * @name exists
     * @function
     * @param {String} name The instance name.
     * @param {Function} cb The callback function.
     */
    exists (name, cb) {
        isThere(this.paths.instance(name), exists => cb(null, exists));
    }

    /**
     * list
     * List the instances.
     *
     * @name list
     * @function
     * @param {Function} cb The callback function.
     */
    list (cb) {
        fs.readdir(this.paths.composition, (err, instances) => {
            if (err) { return cb(err); }
            instances = instances.filter(c => /\.json$/.test(c)).map(c => c.replace(".json", ""));
            cb(null, instances);
        });
    }

    /**
     * readAll
     * Read all the instances.
     *
     * @name readAll
     * @function
     * @param {Function} cb The callback function.
     */
    readAll (cb) {
        this.list((err, instances) => {
            if (err) { return cb(err); }
            var result = {};
            sameTime(instances.map(c => {
                return done => {
                    this.read(c, (err, data) => {
                        if (err) { return cb(err); }
                        result[c] = data;
                        done();
                    });
                }
            }), err => {
                if (err) { return cb(err); }
                cb(null, result);
            });
        });
    }

    /**
     * create
     * Creates a new instance.
     *
     * @name create
     * @function
     * @param {String} name The instance name.
     * @param {Object} data The instance content.
     * @param {Function} cb The callback function.
     */
    create (name, data, cb) {
        if (typeof data === "function") {
            cb = data;
            data = {};
        }
        data = data || {};
        this.exists(name, (err, exists) => {
            if (err) { return cb(err); }
            if (exists) {
                return cb(errors.INSTANCE_EXISTS_ALREADY(name));
            }
            data.name = name;
            wJson(this.paths.instance(name), data, cb);
        })
    }

    /**
     * read
     * Reads the instance content.
     *
     * @name read
     * @function
     * @param {String} name The instance name.
     * @param {Function} cb The callback function.
     */
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

    /**
     * update
     * Updates the instance content.
     *
     * @name update
     * @function
     * @param {String} name The instance name.
     * @param {Object} data The instance content.
     * @param {Function} cb The callback function.
     */
    update (name, data, cb) {
        this.exists(name, (err, exists) => {
            if (err) { return cb(err); }
            if (!exists) {
                return cb(errors.INSTANCE_DOES_NOT_EXIST(name));
            }
            data.name = name;
            wJson(this.paths.instance(name), data, cb);
        });
    }

    /**
     * remove
     * Removes the instance.
     *
     * @name remove
     * @function
     * @param {String} name The instance name.
     * @param {Function} cb The callback function.
     */
    remove (name, cb) {
        this.exists(name, (err, exists) => {
            if (err) { return cb(err); }
            if (!exists) {
                return cb(errors.INSTANCE_DOES_NOT_EXIST(name));
            }
            fs.unlink(this.paths.instance(name), cb);
        });
    }

    /**
     * rename
     * Renames the instance.
     *
     * @name rename
     * @function
     * @param {String} oldName The old instance name.
     * @param {String} newName The new instance name.
     * @param {Function} cb The callback function.
     */
    rename (oldName, newName, cb) {
        this.exists(newName, (err, exists) => {
            if (err) { return cb(err); }
            if (!exists) {
                return cb(errors.INSTANCE_EXISTS_ALREADY(name));
            }
            this.read(oldName, (err, oldInstance) => {
                if (err) { return cb(err); }
                oldInstance.name = newName;
                this.create(newName, oldInstance, err => {
                    if (err) { return cb(err); }
                    this.delete(oldInstance, cb);
                });
            });
        });
    }
}

module.exports = CompositionCRUD;
