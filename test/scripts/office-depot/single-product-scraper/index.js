const path = require("path");
const CcScraperWindow = require('../../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const SingleProductScraper = require("../../../../core/scraper/classes/single-product-scraper");
const getPaginatedResultsFn = require("../../../../server/controllers/api/get-paginated-results-fn");

module.exports = async function(app, ipcMain, pageIndex = 1)   {
    async function getPreReq()  {
        let payload = {
            ccScriptData : {
                fileName : "office-depot",
                apiEndpoint : "office-depots",
            },
            ccScraperData : {
                AppWindowId : null,
                componentId : null,
                scraperType : "single",
            },
        },

        userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
        serverUrl = "http://localhost:7000",
        apiUrl = `${serverUrl}/api/${payload.ccScriptData.apiEndpoint}`,
        { callback, page, pageTotal, data } = await getPaginatedResultsFn(apiUrl, {});

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

    // we apply the singleproduct scraping

    async function scrapeByPage()  {
        let i = pageIndex ? pageIndex : 1,
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

            try {
                let { data : productObjects } = await callback(i);

                await moderator(productObjects, async (slicedArr) => {

                    let promises = slicedArr.map((productObject, item) => {
                        return async () => {
                            let singleProductScraper = new SingleProductScraper({
                                productObject : productObject, 
                                userDataPath, 
                                serverUrl, 
                                payload,
                            });
                    
                            // console.log(singleProductScraper);
                            singleProductScraper.noredirect = false;
                            await singleProductScraper.initialize();
                            
                        }
                    });

                    await Promise.all(promises.map(item => item()));

                }, CcScraperWindow.maxOpenedWindows);

                console.log(i)

                if(i < pageTotal)   {

                    i++;

                    await scrapeData(i);

                }

                
            } catch(err)    {
                console.log({
                    type : "error",
                    message : err.message
                });
            }
            

        }

        await scrapeData(i);

    }

    ipcMain.on("scraper-window-log", (e, data) => {
        console.log(data);
    });
    
        
    await scrapeByPage();

    console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, message : "Finished Single-Product Scraping"});

}