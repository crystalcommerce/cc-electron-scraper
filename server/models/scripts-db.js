const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const scriptsSchema = new Schema({
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
    siteName : {
        type : String,
        required : true,
    },
    siteUrl : {
        type : String,
        required : true,
        unique : true,
    },
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const Script = mongoose.model("Script", scriptsSchema);

// initializing scriptsDb
const scriptsDb = db(Script);
scriptsDb.recordName = "script";

scriptsDb.addProps("uniqueProps", "siteUrl");
scriptsDb.addProps("immutableProps", "_id", "dateCreated");
scriptsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = scriptsDb;