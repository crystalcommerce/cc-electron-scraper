const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const utilitiesSchema = new Schema({
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
}, { strict : true });

const Utilities = mongoose.model("Utility", utilitiesSchema);

// initializing usersDb
const utilitiesDb = db(Utilities);
utilitiesDb.recordName = "utility";
utilitiesDb.addProps("immutableProps", "_id", "dateCreated");
utilitiesDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = utilitiesDb;