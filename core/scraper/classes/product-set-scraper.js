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
const { apiRequest, moderator, sendDataToMainProcess, isObjectInArray } = require("../../../utilities");

class ProductSetScraper {

    constructor({categorizedSet, userDataPath, appAbsPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd})    {

        if(!categorizedSet) {
            return null;
        }

        this.windowId = null;
        this.saveDataOnFinish = typeof saveDataOnFinish === "boolean" ? saveDataOnFinish : false;
        this.closeOnEnd = typeof closeOnEnd === "boolean" ? closeOnEnd : true;

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
        this.noredirect = false;
        this.selectedBrowserSignature = "chrome";

        this.maxRequestLimit = 10;

        this.nextUrl = null;
        this.totalProductObjects = 0;

        this.setApiUrl(payload);

        this.allProductObjects = [];

        this.scraperInfo = {
            windowId : this.windowId,
            scraperType : "product-set-scraper",
        }

    }

    setApiUrl(payload) {
        let { ccScriptData } = payload,
            { apiEndpoint, fileName } = ccScriptData,
            selectedApiEndpoint = apiEndpoint ? apiEndpoint : fileName;

        this.apiUrl = `${this.serverUrl}/api/${selectedApiEndpoint}`;
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

                let promises = slicedArr.map(item => {
                    return async () => {

                        let createResult = await apiRequest(this.apiUrl, {
                            method : "POST",
                            body : JSON.stringify(item, null, 4),
                        }, true);

                        createResults.push(createResult);

                    }
                });

                await Promise.all(promises.map(item => item()));

            }, this.maxRequestLimit);
            
            return createResults;

        } catch(err)    {
            console.log(err.message);
        }
    }

    // async setScraperWindow()
    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.appAbsPath, this.serverUrl, this.appObject);

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

        return {productObjects, newUrl};
    }

    addToAllProductObjects(productObjects)    {

        for(let productObject of productObjects)    {
            if(!isObjectInArray(productObject, this.allProductObjects, ["productUri"]))  {
                this.allProductObjects.push(productObject);
            }
        }

    }

    // async getNewUrl();
    async scrapeDataByUrl(url)   {
        let {productObjects, newUrl} = await this.scrapeData(url);

        // add the productObjects.length to the total;
        this.totalProductObjects += productObjects.length;

        // console.log({productObjects, newUrl, totalProductObjects : this.totalProductObjects});

        this.addToAllProductObjects(productObjects);

        console.log({
            totalScrapedProductObjects : this.totalProductObjects,
            totalUniqueProductObjects : this.allProductObjects.length,
        });

        let createResults = await this.saveData(productObjects);

        sendDataToMainProcess('product-set-scraping-process', createResults);

        if(newUrl)  {
            await this.scrapeDataByUrl(newUrl);
        } else if(this.closeOnEnd) {
            this.ccScraperWindow.close();
        }

    }

    async initialize()  {

        await this.setScraperWindow();

        this.ccScraperWindow.showWindow();

        await this.scrapeDataByUrl(this.categorizedSet.startingPointUrl);

    }

}

module.exports = ProductSetScraper;