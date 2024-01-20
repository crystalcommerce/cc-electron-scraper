const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const configSchema = new Schema({
    key : {
        type : String,
        required : true,
    },
    value : {
        type : String,
        required : true,
    },
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const Config = mongoose.model("Config", configSchema);

// initializing scriptsDb
const configsDb = db(Config);
configsDb.recordName = "configurations";

configsDb.addProps("immutableProps", "_id", "dateCreated");
configsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = configsDb;