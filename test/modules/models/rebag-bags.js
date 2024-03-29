module.exports = function(db, mongoose)   {

    const { Schema } = mongoose;

    const rebagBagSchema = new Schema({
        imageUris : {
            type : Array,
            required : false,
        },
        categorizedSetId : {
            type : String,
            required : true,
        },
        productBrand : {
            type : String,
            required : false,
        },
        productUri : {
            type : String,
            unique : true,
            required : true,
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
        dateCreated : {
            type : String,
            default : Date.now(),
        }
    }, {strict : false});
    
    const RebagBag = mongoose.model("RebagBag", rebagBagSchema);
    
    // initializing tcgTcgPlayerFleshAndBloodsDb
    const RebagBagsDb = db(RebagBag);
    RebagBagsDb.recordName = "bag";
    RebagBagsDb.addProps("uniqueProps", "productUri", "_id");
    RebagBagsDb.addProps("immutableProps", "_id", "dateCreated", "productUri");
    RebagBagsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });
    
    return RebagBagsDb;

}