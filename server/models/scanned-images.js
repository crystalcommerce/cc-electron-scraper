const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const scannedImagesSchema = new Schema({
    imageUrl : {
        type : String,
        required  : true,
    },
    scanResult : {
        type : Object,
        required  : true,
    },
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const ScannedImages = mongoose.model("ScannedImages", scannedImagesSchema);

// initializing scriptsDb
const scannedImagesDb = db(ScannedImages);
scannedImagesDb.recordName = "Scanned Images";

scannedImagesDb.addProps("immutableProps", "_id", "dateCreated");
scannedImagesDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = scannedImagesDb;