const path = require("path");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const ProductSetScraper = require("../../../../core/scraper/classes/product-set-scraper");

module.exports = async function(app)    {

    async function getPaginatedResultsFn(apiUrl, filter, page = 1, limit = 5)  {

        let queryString = objectToQueryString(filter),
            url = `${apiUrl}/paginated?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&${queryString}`,
            getResult = await apiRequest(url, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                },
            }, true),
            {pageTotal, totalCount, data} = getResult;
        
        return {
            callback : async function(newPage) {

                if(newPage > pageTotal)    {
                    return;
                }
    
                let selectedPage = newPage ? newPage : parseInt(page) + 1;
    
                url = `${apiUrl}/paginated?page=${encodeURIComponent(selectedPage)}&limit=${encodeURIComponent(limit)}&${queryString}`;
    
                let getResult = await apiRequest(url, {
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                }, true),
                { pageTotal, totalCount } = getResult;
    
                console.log({pageTotal, totalCount, page : selectedPage});
    
                return getResult;
            },
            pageTotal,
            totalCount,
            page : parseInt(page),
            data
    
        };
        
    }

    async function scrapedDataByCategorizedSet(getPaginatedResults, page=1)    {

        let { data : categorizedSets, pageTotal } = await getPaginatedResults(page);

        selectedPage = page ? page : page + 1;

        app.whenReady().then(async () => {

            let payload = {
                    ccScriptData : {
                        fileName : "grainger-packaging-and-shipping-supplies",
                    },
                    ccScraperData : {
                        AppWindowId : null,
                        componentId : null,
                        scraperType : "set",
                    },
                },
                appAbsPath = app.getAppPath(),
                userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
                serverUrl = "http://localhost:7000";
                
            
            await moderator(categorizedSets, async (slicedArr) => {
    
                let promises = slicedArr.map(categorizedSet => {
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
                        
                        productSetScraper.ccScraperWindow.showWindow();

                    }
                });
    
                await Promise.all(promises.map(item => item()));
    
            }, CcScraperWindow.maxOpenedWindows);
    
            
    
        });
    
    
        app.on('window-all-closed', async (e) => {
    
            console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSets : categorizedSets})
            // e.preventDefault();
            // if (process.platform !== 'darwin') {
            //     app.quit()
            // }

            await scrapedDataByCategorizedSet(getPaginatedResults, page);

        });
    }

    async function getProductsFromSet(page)    {
        let apiUrl = "http://localhost:7000/api/categorized-sets",
            filter = {
                siteName : "Grainger",
                siteUrl : "www.grainger.com",
            },
            {callback : getPaginatedResults, pageTotal, } = await getPaginatedResultsFn();

        // return await getPaginatedResults(page);

        scrapedDataByCategorizedSet(getPaginatedResults)
        
    }

    let categorizedSets = [];

    
}