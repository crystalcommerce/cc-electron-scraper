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
const { apiRequest, moderator } = require("../../../utilities");

class ProductSetScraper {

    constructor({categorizedSet, userDataPath, appAbsPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd, evaluatorIndex})    {

        if(!categorizedSet) {
            return null;
        }

        this.windowId = ccScraperWindow ? ccScraperWindow.windowId : null;
        this.saveDataOnFinish = typeof saveDataOnFinish === "boolean" ? saveDataOnFinish : false;
        this.closeOnEnd = typeof closeOnEnd === "boolean" ? closeOnEnd : true;
        this.evalautorIndex = typeof evaluatorIndex === "number" ? evaluatorIndex : 0;

        this.categorizedSet = categorizedSet;
        this.categorizedSetId = this.categorizedSet[this.uniquePropName];
        this.categoryObject = this.categorizedSet.categoryObject;
        this.startingPointUrl = this.categorizedSet.startingPointUrl;

        this.ccScraperWindow = null;
        this.evaluator = null;

        this.showWindow = false;

        this.userDataPath = userDataPath;
        this.appAbsPath = appAbsPath;
        this.serverUrl = serverUrl; 
        this.apiUrl = null;
        this.payload = payload;
        this.appObject = appObject && appObject.ready ? appObject : {ready : true};

        this.maxRequestLimit = 10;

        this.nextUrl = null;
        this.totalProductObjects = 0;

        this.setApiUrl(payload);

    }

    setApiUrl(payload) {
        let { ccScriptData } = payload,
            { fileName } = ccScriptData;

        this.apiUrl = `${this.serverUrl}/api/${fileName}`;
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

            await moderator(dataObjects, async (slicedArr) => {

                let promises = slicedArr.map(item => {
                    return async function() {

                        let createResult = await apiRequest(this.apiUrl, {
                            method : "POST",
                            body : JSON.stringify(item, null, 4),
                        }, true);

                        return createResult;

                    }
                });

                await Promise.all(promises.map(item => item()));

            }, this.maxRequestLimit);
            

        } catch(err)    {
            console.log(err.message);
        }
    }

    // async setScraperWindow()
    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.appAbsPath, this.serverUrl, this.appObject, this.evaluatorIndex);

        this.ccScraperWindow = ccScraperWindow;
        this.evaluator = evaluator;
    }

    async scrapeData(url)    {
        let {productObjects, newUrl} = await evaluatePage({
            ccScraperWindow : this.ccScraperWindow,
            dataObject : this.productObject,
            uriPropName : url,
            uniquePropName : this.uniquePropName,
            closeOnEnd : false,
            saveDataOnFinish : false,
        });

        return {productObjects, newUrl};
    }

    

    // async getNewUrl();
    async scrapeDataByUrl(url)   {
        let {productObjects, newUrl} = await scrapeData(url);

        // add the productObjects.length to the total;
        this.totalProductObjects += productObjects.length;

        console.log({productObjects, newUrl, totalProductObjects : this.totalProductObjects});

        await this.saveData(productObjects);

        if(newUrl)  {
            await this.scrapeDataByUrl(newUrl)
        } else if(this.closeOnEnd) {
            
        }

    } 

    // async loadNewPage();

    // async scrapeData();

}

module.exports = ProductSetScraper;