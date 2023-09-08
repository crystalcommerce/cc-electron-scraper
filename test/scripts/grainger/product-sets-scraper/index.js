const path = require("path");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const ProductSetScraper = require("../../../../core/scraper/classes/product-set-scraper");

module.exports = async function(app, ipcMain)    {

    async function getPaginatedResultsFn(apiUrl, filter, page = 1, limit = 5)  {

        let queryString = objectToQueryString(filter),
            url = `${apiUrl}/paginated?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&${queryString}`,
            getResult = await apiRequest(url, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                },
            }, true),
            { pageTotal : initialPageTotal, totalCount, data } = getResult;

        console.log({
            page,
            limit
        });
        
        return {
            callback : async function(newPage) {

                if(newPage > initialPageTotal)    {
                    return;
                }
                
                let selectedPage = newPage ? newPage : page;
    
                url = `${apiUrl}/paginated?page=${encodeURIComponent(selectedPage)}&limit=${encodeURIComponent(limit)}&${queryString}`;
    
                let getResult = await apiRequest(url, {
                    method : "GET",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                }, true),
                { pageTotal, totalCount } = getResult;
    
                console.log({pageTotal, totalCount, page : selectedPage});

                page = selectedPage;
                page = parseInt(page) + 1;
    
                return getResult;
            },
            pageTotal : initialPageTotal,
            totalCount,
            page : parseInt(page),
            data
    
        };
        
    }

    async function getPreReq()  {
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

        userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
        serverUrl = "http://localhost:7000",
        categorizedSetApiUrl = `${serverUrl}/api/categorized-sets`,
        {callback, page, pageTotal, data} = await getPaginatedResultsFn(categorizedSetApiUrl, {siteName : "Grainger", siteUrl : "www.grainger.com"});

        return {
            callback, 
            page, 
            pageTotal,
            data,
            payload, 

            userDataPath,
            serverUrl,
        }
    }

    async function scrapeByPage()  {
        let i = 1,
            {
                callback, 
                page, 
                pageTotal,
                data,
                payload, 

                userDataPath,
                serverUrl,
            } = await getPreReq();

        async function scrapeData(i = 1) {
            let { data : categorizedSets } = await callback(i);

            await moderator(categorizedSets, async (slicedArr) => {

                let promises = slicedArr.map((categorizedSet, item) => {
                    return async () => {
                        let productSetScraper = new ProductSetScraper({
                            categorizedSet : categorizedSet, 
                            userDataPath, 

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

    app.whenReady().then(async () => {

        ipcMain.on("scraper-window-log", (e, data) => {
            console.log(data);
        });
    
        
        await scrapeByPage();

    });


    app.on('window-all-closed', async (e) => {

        console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }

    });

    
}