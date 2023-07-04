module.exports = function(db, mongoose)   {

    const { Schema } = mongoose;

    const graingerPackagingAndShippingSupplySchema = new Schema({
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
        multiFaced : {
            type : String,
            required : false,
        },
        dateCreated : {
            type : String,
            default : Date.now(),
        }
    }, {strict : false});
    
    const graingerPackagingAndShippingSupply = mongoose.model("graingerPackagingAndShippingSupply", graingerPackagingAndShippingSupplySchema);
    
    // initializing tcgTcgPlayerFleshAndBloodsDb
    const graingerPackagingAndShippingSuppliesDb = db(graingerPackagingAndShippingSupply);
    graingerPackagingAndShippingSuppliesDb.recordName = "packaging and shipping supply";
    graingerPackagingAndShippingSuppliesDb.addProps("uniqueProps", "_id", "productUri");
    graingerPackagingAndShippingSuppliesDb.addProps("immutableProps", "_id", "dateCreated");
    graingerPackagingAndShippingSuppliesDb.addProps("defaultValuedProps", { dateCreated : Date.now() });
    
    return graingerPackagingAndShippingSuppliesDb;

}