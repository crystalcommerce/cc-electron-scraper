const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const routesSchema = new Schema({
    fileName : {
        type : String,
        required  : true,
    },
    fileExtension : {
        type : String,
        required  : true,
    },
    fileNameWithExt : {
        type : String,
        required  : true,
        unique : true,
    },
    textData : {
        type : String,
        required : true,
    },
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const Route = mongoose.model("Route", routesSchema);

// initializing routesDb
const routesDb = db(Route);
routesDb.recordName = "route";
routesDb.addProps("immutableProps", "_id", "dateCreated");
routesDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = routesDb;