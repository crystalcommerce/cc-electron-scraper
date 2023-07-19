const path = require("path");
const getPaginatedResultsFn = require("../../../../server/controllers/api/get-paginated-results-fn");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const ProductSetScraper = require("../../../../core/scraper/classes/product-set-scraper");

async function getPreReq(app)  {
    let payload = {
        ccScriptData : {
            fileName : "office-depot",
            apiEndpoint : "office-depots",
        },
        ccScraperData : {
            AppWindowId : null,
            componentId : null,
            scraperType : "set",
        },
    },
    appAbsPath = app.getAppPath(),
    userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
    serverUrl = "http://localhost:7000",
    categorizedSetApiUrl = `${serverUrl}/api/categorized-sets`,
    {callback, page, pageTotal, data} = await getPaginatedResultsFn(categorizedSetApiUrl, {siteName : "office-depot", siteUrl : "https://www.officedepot.com/"});

    return {
        callback, 
        page, 
        pageTotal,
        data,
        payload, 
        appAbsPath, 
        userDataPath,
        serverUrl,
    }
}

async function scrapeByPage(app)  {
    let i = 1,
        {
            callback, 
            page, 
            pageTotal,
            data,
            payload, 
            appAbsPath, 
            userDataPath,
            serverUrl,
        } = await getPreReq(app);

    async function scrapeData(i = 1) {
        let { data : categorizedSets } = await callback(i);

        await moderator(categorizedSets, async (slicedArr) => {

            let promises = slicedArr.map((categorizedSet, item) => {
                return async () => {
                    let productSetScraper = new ProductSetScraper({
                        categorizedSet : categorizedSet, 
                        userDataPath, 
                        appAbsPath, 
                        serverUrl, 
                        payload, 
                    });
            
                    console.log(productSetScraper);
            
                    await productSetScraper.initialize();
                    
                }
            });

            await Promise.all(promises.map(item => item()));

        }, CcScraperWindow.maxOpenedWindows);

        console.log(i)

        if(i < pageTotal)   {

            i++;

            await scrapeData(i);

        }
        
    }

    await scrapeData(i);

}

module.exports = async function(app, ipcMain)   {
    
    app.whenReady().then(async () => {

        ipcMain.on("scraper-window-log", (e, data) => {
            console.log(data);
        });
    
        
        await scrapeByPage(app);

        app.quit();

    });


    app.on('window-all-closed', async (e) => {

        console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length});
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }

    });

}