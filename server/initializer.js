const path = require("path");
const { createDirPath, writeFile } = require("../utilities");
const modelsDb = require("./models/models-db");
const routesDb = require("./models/routes-db");
const scriptsDb = require("./models/scripts-db");
const mongoose = require('mongoose');

const dotenv = require("dotenv");
// const usersDb = require("./models/users-db");
const cloneUtilites = require("./controllers/api/clone-utilites");
const deleteTempFiles = require("./controllers/api/delete-temp-files");
dotenv.config();

async function createFiles(payload) {


    let { targetDirPath } = payload,
        scriptsDirPath = await createDirPath(path.join(targetDirPath, "modules", "scripts")),
        routesDirPath = await createDirPath(path.join(targetDirPath, "modules", "routes")),
        modelsDirPath = await createDirPath(path.join(targetDirPath, "modules", "models")),
        tempFilesDirPath = await createDirPath(path.join(targetDirPath, "modules", "temp")),
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

    // create the utilities here...
    await cloneUtilites(targetDirPath);

    // delete all temporary files here...
    await deleteTempFiles(tempFilesDirPath);

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

                console.log("DB Connection established...");
                console.log("Creating the necessary JS modules.");

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