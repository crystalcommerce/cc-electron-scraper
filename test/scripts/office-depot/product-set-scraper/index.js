const path = require("path");
const getPaginatedResultsFn = require("../../../../server/controllers/api/get-paginated-results-fn");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest, slowDown } = require('../../../../utilities');
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

async function checkTheUnscrapedData(serverUrl, payload)  {
    // some tests to check the total number of data scraped...

    let categorizedSets = await apiRequest(`${serverUrl}/api/categorized-sets/all?siteUrl=https://www.officedepot.com/`),
        productObjectsByCategory = [],
        index = 0;

    // console.log(categorizedSets);

    await moderator(categorizedSets, async (slicedArr) => {

        let [categorizedSet] = slicedArr,
            {setData} = categorizedSet,
            queryString = objectToQueryString(setData),
            apiEndpoint = payload.ccScriptData.apiEndpoint,
            apiUrl = `${serverUrl}/api/${apiEndpoint}/paginated?${queryString}`,
            result = await apiRequest(apiUrl),
            obj = {...setData, totalCount : result.totalCount, index};

        // console.log(result);

        
        productObjectsByCategory.push(obj);
        console.log(obj);
        // await slowDown();

        index++;

    }, 1);

    console.log(productObjectsByCategory);
}

async function scrapeByPage(app, categorizedSetPage)  {
    let i = categorizedSetPage,
        {
            callback, 
            page, 
            pageTotal,
            data,
            payload, 
            appAbsPath, 
            userDataPath,
            serverUrl,
            apiEndpoint, // optional
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
                        updateOnPrevPointUrl : true,
                    });
            
                    console.log(productSetScraper);
            
                    await productSetScraper.initialize();
                    
                }
            });

            await Promise.all(promises.map(item => item()));

        }, CcScraperWindow.maxOpenedWindows);

        console.log({i, pageTotal})

        if(i < pageTotal)   {

            i++;

            await scrapeData(i);

        }
        
    }

    await scrapeData(i);

    



    // check the unscraped data;
    // await checkTheUnscrapedData(serverUrl, payload);    

}

module.exports = async function(app, ipcMain)   {

    ipcMain.on("scraper-window-log", (e, data) => {
        console.log(data);
    });

    await scrapeByPage(app, 15);

    console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, message : "Finished Product-set-scraping"});
    

}