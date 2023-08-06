const path = require("path");
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 7000;
const dotenv = require("dotenv");
const session = require("express-session");

const getRouteModelObjects = require("./controllers/api/get-route-model-objects");


/***************************
 * 
 *  app and env instances
 * 
***************************/

    dotenv.config();
    const app = express();


/***********************
 * 
 *  Routes
 * 
***********************/

const allRoutes = require("./routes");



/***********************
 * 
 *  Middlewares
 * 
***********************/

    const baseUrl = require("./middlewares/base-url");
    
   
    

async function startServer(userDataPath)  {
    
    /**********************************
     * 
     *  Dynamic Route and Models
     * 
    ***********************************/
    const routeModelObjects = await getRouteModelObjects(userDataPath);

    
    /**********************
     * 
     *  Db Connection
     * 
    ***********************/
    // OLD_PROD_DB_CONNECT => DEV_DB_CONNECT =>  PROD_DB_CONNECT 

    const selectedDatabase = process.env.COMPUTER_ENV === "Development" ? process.env.OLD_PROD_DB_CONNECT : process.env.PROD_DB_CONNECT;

    console.log({selectedDatabase, env : process.env.COMPUTER_ENV});

    mongoose.connect(selectedDatabase, {
        useNewUrlParser : true, 
        useUnifiedTopology : true, 
    })
        .then(() => {


            app.listen(port, async () => {

                console.log(`Server has initialized at port ${port}`);

                process.send({message : "server-has-initialized", payload : `http://localhost:${port}`});
                
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


    // use all routes
    /***********************
     * 
     *  Api Routes
     * 
    ***********************/
    /* All Routes... */
    app.use(allRoutes(routeModelObjects));


    app.get("/", (req, res) => {

        res.send(`<p>Hello from ${req.siteUrl}</p>`);

    });

    app.use(express.static(path.join(__dirname, 'views')));
    
}


// console.log(process);
process.on("message", async (data) => {

    let {type, payload} = data; 

    if(type === "app-data-dir-path")    {
        // const allFiles = await getAllFilesFromDirectory(payload);
        // console.log(allFiles);

        // console.log({type, payload});
        startServer(payload);

    }
    
    
});

