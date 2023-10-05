/* 

    ProductSetScraping;

    we get the categorizedSet;

    we get the categorizedSet id;

    we also get the categoryObject and add them to each of the product objects that will be added to the products database;

    get product set by id, 

    get the category object,

    all products that will be scraped will have a category object;

    we initialize multi-single-product-set-scraping;

    we can utilize paginated product querying to minimize the resources that are getting used.

    we save the data to the database;

*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, moderator, sendDataToMainProcess, isObjectInArray, slowDown } = require("../../../utilities");

class ProductSetScraper {

    constructor({categorizedSet, userDataPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd, updateOnPrevPointUrl})    {

        if(!categorizedSet) {
            return null;
        }

        this.AppWindowId = null;
        this.componentId = null;
        this.windowId = ccScraperWindow ? ccScraperWindow.windowId : null;
        this.saveDataOnFinish = typeof saveDataOnFinish === "boolean" ? saveDataOnFinish : false;
        this.closeOnEnd = typeof closeOnEnd === "boolean" ? closeOnEnd : true;

        this.ccScraperWindow = null;
        this.evaluator = null;

        this.showWindow = false;

        this.userDataPath = userDataPath;
        this.serverUrl = serverUrl; 
        this.apiUrl = null;
        this.payload = payload;
        this.scriptData = this.payload.ccScriptData;
        this.scraperData = this.payload.ccScraperData;
        this.scriptData = this.ccScriptData.siteName;
        this.scraperData = this.ccScriptData.siteUrl;

        this.categorizedSet = categorizedSet;
        this.categorizedSetId = this.categorizedSet['_id'];
        this.categoryObject = this.categorizedSet.categoryObject;
        this.startingPointUrl = this.categorizedSet.startingPointUrl;
        
        this.updateOnPrevPointUrl = updateOnPrevPointUrl ? updateOnPrevPointUrl : false;
        this.prevPointUrl = this.updateOnPrevPointUrl && this.categorizedSet.prevPointUrl ? this.categorizedSet.prevPointUrl : null;

        this.appObject = appObject && appObject.ready ? appObject : {ready : true};
        this.noredirect = false;
        this.selectedBrowserSignature = "chrome";

        this.maxRequestLimit = 50;

        this.nextUrl = null;
        this.totalProductObjects = 0;

        this.setApiUrl(payload);

    }

    getScraperInfo()    {
        return {
            AppWindowId : this.AppWindowId,
            componentId : this.componentId,
            windowId : this.windowId,
            scraperType : this.payload.ccScraperData.scraperType,
        }
    }

    setApiUrl(payload) {
        let { ccScriptData } = payload,
            { apiEndpoint, fileName } = ccScriptData,
            selectedApiEndpoint = apiEndpoint ? apiEndpoint : fileName;

        this.apiUrl = `${this.serverUrl}/api/${selectedApiEndpoint}/create-multiple`;
    }

    clearUserData() {
        clearUserData();
    }

    // async saveData()
    async saveData(dataObjects = [])    {
        try {

            if(!Array.isArray(dataObjects)) {
                return;
            }

            let createResults = [];

            await moderator(dataObjects, async (slicedArr) => {

                let createMulitpleResult = await apiRequest(this.apiUrl, {
                    method : "POST",
                    body : JSON.stringify(slicedArr, null, 4),
                }, true);

                createMulitpleResult.forEach(item => {
                    createResults.push({
                        message : item.message,
                        statusOk : item.statusOk
                    });
                });

                await slowDown(2525);

            }, this.maxRequestLimit);
            
            return createResults;

        } catch(err)    {
            console.log({
                message : `Error in saving products to db : ${err.message}`,
                type : "DB Create Document Error",
                statusOk : false,
            });
        }
    }

    // async setScraperWindow()
    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.serverUrl, this.appObject);

        this.ccScraperWindow = ccScraperWindow;
        this.evaluator = evaluator;
        this.windowId = ccScraperWindow.windowId;
    }

    async scrapeData(url)    {

        let { productObjects, newUrl } = await evaluatePage({
            ccScraperWindow : this.ccScraperWindow,
            dataObject : this.categorizedSet,
            resourceUri : url,
            uniquePropName : this.uniquePropName,
            closeOnEnd : false,
            saveDataOnFinish : false,
            noredirect : this.noredirect,
            selectedBrowserSignature : this.selectedBrowserSignature,
        });

        // console.log({
        //     message : `we have recieved the data from windowId : ${this.windowId}; we now have to save it...`,
        //     scrapedProductObjects : productObjects.length
        // })

        return {productObjects, newUrl};
    }

    async updatePrevPointUrl(newUrl)    {
        
        let apiUrl = `${this.serverUrl}/api/categorized-sets/${this.categorizedSetId}`,
            result = await apiRequest(apiUrl, {
                method : "PUT",
                body : JSON.stringify({
                    prevPointUrl : newUrl,
                }),
                headers : {
                    "Content-Type" : "application/json"
                }
            }, true);

        return result;

    }

    // async getNewUrl();
    async scrapeDataByUrl(url)   {

        try {


            let {productObjects, newUrl} = await this.scrapeData(url);

            // add the productObjects.length to the total;
            this.totalProductObjects += productObjects.length;

            // console.log({productObjects, newUrl, totalProductObjects : this.totalProductObjects});

            // console.log({
            //     message : "saving data to database...",
            //     windowId : this.windowId,
            //     totalProductObjects : this.totalProductObjects,
            //     scrapedProductsFromWindow : productObjects.length,
            // });

            let createResults = await this.saveData(productObjects);

            // console.log({
            //     message : "saving products to db process has been done.",
            //     windowId : this.windowId,
            //     createResults : JSON.stringify(createResults, null, 4),
            //     totalProductObjects : this.totalProductObjects,
            //     scrapedProductsFromWindow : productObjects.length,
            // });

            sendDataToMainProcess('product-set-scraping-process', createResults);

            if(newUrl)  {

                let updateResult = await this.updatePrevPointUrl(newUrl);

                await this.scrapeDataByUrl(newUrl);

            } else if(this.closeOnEnd) {
                await this.ccScraperWindow.close();
            }


        } catch(err)    {

            if(this.closeOnEnd) {
                await this.ccScraperWindow.close();
            }

        }

        

    }

    async initialize()  {

        await this.setScraperWindow();

        // TODO: hide window...
        this.ccScraperWindow.showWindow();

        let startingPointUrl = this.prevPointUrl ? this.prevPointUrl : this.startingPointUrl;

        await this.scrapeDataByUrl(startingPointUrl);

    }

}

module.exports = ProductSetScraper;