const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const scannedImagesSchema = new Schema({
    imageUrl : {
        type : String,
        required  : true,
        unique : true,
    },
    successfullyScanned : {
        type : Boolean,
        required : true,
    },
    scanResult : {
        type : Object,
        required  : true,
    },
    productApiUrl : {
        type : String, 
        required : true,
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
scannedImagesDb.addProps("uniqueProps", "_id", "imageUrl");
scannedImagesDb.addProps("immutableProps", "_id", "dateCreated", "imageUrl");
scannedImagesDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = scannedImagesDb;