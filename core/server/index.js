const path = require("path");
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 7000;
const dotenv = require("dotenv");
const session = require("express-session");



/***************************
 * 
 *  app and env instances
 * 
***************************/

    dotenv.config();
    const app = express();



/***********************
 * 
 *  Middlewares
 * 
***********************/

    const baseUrl = require("./middlewares/base-url");
    

/***********************
 * 
 *  Api Routes
 * 
***********************/

    // const allRoutes = require("./routes");

/**********************
 * 
 *  Db Connection
 * 
***********************/
// OLD_PROD_DB_CONNECT => DEV_DB_CONNECT =>  PROD_DB_CONNECT 
    mongoose.connect(process.env.OLD_PROD_DB_CONNECT, {
        useNewUrlParser : true, 
        useUnifiedTopology : true, 
    })
        .then(() => {


            app.listen(port, async () => {

                console.log(`Server has initialized at port ${port}`);
                
            });

        })
        .catch(err => console.log(err));



/****************************
 * 
 *  Middlewares Instances
 * 
****************************/

    app.use(express.urlencoded({extended : true}));    
    app.use(express.json({extended : true}));
    app.use(cors({
        origin: '*'
    }));
    app.use(session({
        secret: "electron-js-scraper",
        saveUninitialized:true,
        cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
        resave: false 
    }));
    app.use(baseUrl());

    app.get("/", (req, res) => {

        res.send(`<p>Hello from ${req.siteUrl}</p>`);

    });