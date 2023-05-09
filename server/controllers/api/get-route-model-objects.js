const path = require("path");
const {Router} = require("express");
const mongoose = require("mongoose");
const db = require("../../models/classes/database");
const getDynamicController = require("../index");
const { getAllFilesFromDirectory, getFileObject } = require("../../../utilities");
const httpResponseHandler = require("../../middlewares/http-response-handler");

module.exports = async function (userDataPath)  {

    let allModelFiles = await getAllFilesFromDirectory(path.join(userDataPath, "modules", "models")),
        allRouteFiles = await getAllFilesFromDirectory(path.join(userDataPath, "modules", "routes")),
        allScriptFiles = await getAllFilesFromDirectory(path.join(userDataPath, "modules", "scripts"));

    let allModelObjects = allModelFiles.map(item => {

        let {name, fileType} = getFileObject(item),
            fileName = `${name}${fileType}`,
            filePath = path.join(userDataPath, "modules", "models", fileName);

        let dbModule = require(filePath);

        return {
            fileName,
            dbModule,
        }
        
    });

    let allRouteHandlers = allRouteFiles.map(item => {

        let {name, fileType} = getFileObject(item),
            fileName = `${name}${fileType}`,
            filePath = path.join(userDataPath, "modules", "routes", fileName),
            routeHandler = null;

        let routeModule = require(filePath),
            foundModel = allModelObjects.find(item => item.fileName === fileName);
        
        if(foundModel)  {
            let {dbModule} = foundModel,
                dbInstance = dbModule(db, mongoose);

            routeHandler = routeModule(Router, dbInstance, getDynamicController, httpResponseHandler);

        }

        return routeHandler;


    }).filter(item => item);

    return allRouteHandlers;

}