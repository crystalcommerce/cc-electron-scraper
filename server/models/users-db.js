const db = require("./classes/database");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName : {
        type : String,
        required  : true,
    },
    lastName : {
        type : String,
        required  : true,
    },
    username : {
        type : String,
        required  : true,
        unique : true,
    },
    password : {
        type : String,
        required  : true,
    },
    roleName : {
        type : String,
        required : true,
    },
    allPermissionsGranted : {
        type : Boolean,
        required : true,
        default : false,
    },
    grantedPermissions : {
        type : Array,
        required : true,
        default : [],
    },
    friendlyUrl : {
        type : String,
        required  : true,
    }, 
    dateCreated : {
        type : Date,
        default : Date.now(),
    },
}, {strict : true});

const User = mongoose.model("User", userSchema);


// initializing usersDb
const usersDb = db(User);
usersDb.recordName = "user";
usersDb.addProps("uniqueProps", "username");
usersDb.addProps("hashedProps", "password");
usersDb.addProps("immutableProps", "_id", "dateCreated", "username");
usersDb.addProps("friendlyUrlProps", "firstName", "lastName");
usersDb.addProps("defaultValuedProps", { permissionLevel : 2 }, { dateCreated : Date.now() });
usersDb.addProps("uniqueUrlConstraints", "permissionLevel");

module.exports = usersDb;