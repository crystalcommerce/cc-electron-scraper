const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const modelsSchema = new Schema({
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

const Model = mongoose.model("Model", modelsSchema);

// initializing usersDb
const modelsDb = db(Model);
modelsDb.recordName = "model";
modelsDb.addProps("immutableProps", "_id", "dateCreated");
modelsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = modelsDb;