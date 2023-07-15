const path = require("path");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, createJsonFileObject, isObjectInArray, apiRequest } = require('../../../../utilities');
const ProductSetScraper = require("../../../../core/scraper/classes/product-set-scraper");
const evaluatePage = require("../../../../electron/api/scraper-window/evaluate-page");
const createScraperWindow = require("../../../../electron/api/scraper-window/create-scraper-window");

async function getPreReq(app)    {
    let payload = {
        ccScriptData : {
            fileName : "office-depot",
        },
        ccScraperData : {
            AppWindowId : null,
            componentId : null,
            scraperType : "categorizedSets",
        },
    },
    appAbsPath = app.getAppPath(),
    userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
    serverUrl = "http://localhost:7000";

    return {
        payload,
        appAbsPath,
        userDataPath,
        serverUrl,
    }
}



module.exports = async function(app, ipcMain)    {
    app.whenReady().then(async () => {

        let {
                payload,
                appAbsPath,
                userDataPath,
                serverUrl,
            } = await getPreReq(app),
            { ccScraperWindow, evaluator } = await createScraperWindow(payload, userDataPath, appAbsPath, serverUrl, {ready : true});
        
        ccScraperWindow.showWindow();

        let categorizedSets = await evaluatePage({
                ccScraperWindow,
                resourceUri : "https://www.officedepot.com/",
                dataObject : { siteUrl : "https://www.officedepot.com/", siteName : "office-depot" },
                uriPropName : "startingPointUrl",
                closeOnEnd : true,
            }),
            createResults = [],
            apiUrl = `http://localhost:7000/api/categorized-sets/`;

        console.log(categorizedSets);

        await moderator(categorizedSets, async (slicedArr) => {

            let promises = slicedArr.map(item => {
                return async () => {

                    let createResult = await apiRequest(apiUrl, {
                        method : "POST",
                        body : JSON.stringify(item, null, 4),
                    }, true);

                    createResults.push(createResult);

                }
            });

            await Promise.all(promises.map(item => item()));

        }, 10);

        console.log(createResults);


        app.quit();
        
    });

    

    app.on('window-all-closed', (e) => {

        // console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSet : categorizedSet})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}