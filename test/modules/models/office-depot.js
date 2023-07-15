module.exports = function(db, mongoose)   {

    const { Schema } = mongoose;

    const officeDepotSchema = new Schema({
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
    
    const officeDepot = mongoose.model("officeDepot", officeDepotSchema);
    
    // initializing tcgTcgPlayerFleshAndBloodsDb
    const officeDepotsDb = db(officeDepot);
    officeDepotsDb.recordName = "office depot products";
    officeDepotsDb.addProps("uniqueProps", "_id", "productUri");
    officeDepotsDb.addProps("immutableProps", "_id", "dateCreated");
    officeDepotsDb.addProps("defaultValuedProps", { dateCreated : Date.now() });
    
    return officeDepotsDb;

}