
// const mongoose = require("mongoose");
// const db = require("../classes/database");

module.exports = function(db, mongoose)   {

    const { Schema } = mongoose;

    const rebagBagSchema = new Schema({
        imageUris : {
            type : Array,
            required : false,
        },
        productBrand : {
            type : String,
            required : false,
        },
        productName : {
            type : String,
            required : false,
        },
        productCondition : {
            type : String,
            required : false,
        },
        originalPrice : {
            type : String,
            required : false,
        },
        regularPrice : {
            type : String,
            required : false,
        },
        multiFaced : {
            type : String,
            required : false,
        },
        productUris : {
            type : Array,
            required : false,
        },
        dateCreated : {
            type : String,
            default : new Date(Date.now()).toISOString(),
        }
    }/* , {strict : true} */);
    
    const RebagBag = mongoose.model("RebagBag", rebagBagSchema);
    
    // initializing tcgTcgPlayerFleshAndBloodsDb
    const RebagBagsDb = db(RebagBag);
    RebagBagsDb.recordName = "bag"
    
    return RebagBagsDb;

}
