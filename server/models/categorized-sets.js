const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorizedSetsSchema = new Schema({
    siteName : {
        type : String,
        required : true,
    },
    siteUrl : {
        type : String,
        required : true,
    },
    setData : {
        type : Object,
        required : true,
    },
    startingPointUrl : {
        type : String,
        required : true,
    },
    prevPointUrl : {
        type : String,
        required : false,
        default : null,
    },
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const CategorizedSet = mongoose.model("CategorizedSet", categorizedSetsSchema);

// initializing scriptsDb
const categorizedSetsDb = db(CategorizedSet);
categorizedSetsDb.recordName = "categorized-set";

categorizedSetsDb.addProps("immutableProps", "_id", "dateCreated");
categorizedSetsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });

module.exports = categorizedSetsDb;