const path = require("path");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const SingleProductScraper = require("../../../../core/scraper/classes/single-product-scraper");

module.exports = async function(app, ipcMain)   {

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
                scraperType : "single",
            },
        },
        appAbsPath = app.getAppPath(),
        userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
        serverUrl = "http://localhost:7000",
        apiUrl = `${serverUrl}/api/grainger-packaging-and-shipping-supplies`,
        { callback, page, pageTotal, data } = await getPaginatedResultsFn(apiUrl, {});

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

    // we apply the singleproduct scraping

    async function scrapeByPage()  {
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
            } = await getPreReq();

        async function scrapeData(i = 1) {

            try {
                let { data : productObjects } = await callback(i);

                await moderator(productObjects, async (slicedArr) => {

                    let promises = slicedArr.map((productObject, item) => {
                        return async () => {
                            let singleProductScraper = new SingleProductScraper({
                                productObject : productObject, 
                                userDataPath, 
                                appAbsPath, 
                                serverUrl, 
                                payload, 
                            });
                    
                            console.log(singleProductScraper);
                    
                            await singleProductScraper.initialize();
                            
                        }
                    });

                    await Promise.all(promises.map(item => item()));

                }, CcScraperWindow.maxOpenedWindows);

                console.log(i)

                i++;

                await scrapeData(i);
            } catch(err)    {
                console.log({
                    type : "error",
                    message : err.message
                });
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