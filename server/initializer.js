const path = require("path");
const { createDirPath, writeFile } = require("../utilities");
const modelsDb = require("./models/models-db");
const routesDb = require("./models/routes-db");
const scriptsDb = require("./models/scripts-db");
const mongoose = require('mongoose');
const port = process.env.PORT || 7000;
const dotenv = require("dotenv");
const usersDb = require("./models/users-db");
dotenv.config();

async function createFiles(payload) {


    let { targetDirPath } = payload,
        scriptsDirPath = await createDirPath(path.join(targetDirPath, "modules", "scripts")),
        routesDirPath = await createDirPath(path.join(targetDirPath, "modules", "routes")),
        modelsDirPath = await createDirPath(path.join(targetDirPath, "modules", "models")),
        allModels = await modelsDb.getAll(),
        allRoutes = await routesDb.getAll(),
        allScripts = await scriptsDb.getAll();

    const createCallback = (arr, dirPath) => {
        return arr.map((item) => {
            return async function() {
    
                let {fileName, fileType, textData} = item,
                    filePath = path.join(dirPath, `${fileName}.${fileType}`);
    
                return await writeFile(filePath, textData);
    
            }
        });
    }


    const modelsPromises = createCallback(allModels, modelsDirPath);

    const routesPromises = createCallback(allRoutes, routesDirPath);

    const scriptsPromises = createCallback(allScripts, scriptsDirPath);

    let modelsResults = await Promise.all(modelsPromises.map(item => item())),
        routesResults = await Promise.all(routesPromises.map(item => item())),
        scriptsResults = await Promise.all(scriptsPromises.map(item => item()));


    return {
        modelsResults,
        routesResults,
        scriptsResults,
    }
    
}

process.on("message", async(data) => {
    if(data.message === "create-required-modules")  {
        

        mongoose.connect(process.env.OLD_PROD_DB_CONNECT, {
            useNewUrlParser : true, 
            useUnifiedTopology : true, 
        })
            .then(() => {

                console.log("We are connected.. to db");

                createFiles(data.payload)
                    .then((result) => {

                        // console.log(result);

                        process.send({
                            message : "required-modules-created",
                            payload : result,
                        });

                    });

            })
            .catch(err => console.log(err));
    }

})