/* 

    // we initialize the scraper,
    // send the browser browser scraper class 
    // send the browser the 


*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, moderator, sendDataToMainProcess, isObjectInArray, slowDown } = require("../../../utilities");

class CategorizedSetScraper {

    constructor({userDataPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd})    {

        if(!payload.ccScriptData.siteUrl && payload.ccScriptData.siteName)    {
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

        this.siteUrl = payload.ccScriptData.siteUrl;
        this.siteName = payload.ccScriptData.siteName;
        this.startingPointUrl = this.scriptData.startingPointUrl ? this.scriptData.startingPointUrl : this.siteName;

        this.appObject = appObject && appObject.ready ? appObject : {ready : true};
        this.noredirect = false;
        this.selectedBrowserSignature = "chrome";

        this.maxRequestLimit = 50;

        this.categorizedSets = [];

        this.setApiUrl();

    }

    getScraperInfo()    {
        return {
            AppWindowId : this.AppWindowId,
            componentId : this.componentId,
            windowId : this.windowId,
            scraperType : this.payload.ccScraperData.scraperType,
            siteName : this.siteName,
            siteUrl : this.siteUrl,
        }
    }

    setApiUrl() {
        let selectedApiEndpoint = "categorized-sets";

        this.apiUrl = `${this.serverUrl}/api/${selectedApiEndpoint}/create-multiple`;
    }

    clearUserData() {
        clearUserData();
    }

    async saveData()    {

        try {

            let createResults = [];

            await moderator(this.categorizedSets, async (slicedArr) => {

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
                message : `Error in saving categorized-sets to db : ${err.message}`,
                type : "DB Create Document Error",
                statusOk : false,
            });
        }
    }
    
    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.serverUrl, this.appObject);

        this.ccScraperWindow = ccScraperWindow;
        this.evaluator = evaluator;
        this.windowId = ccScraperWindow.windowId;
    }

    async scrapeData(recursive = false)  {

        if(recursive)   {

            await this.scrapeDataRecursively();

            await this.saveData();

        } else  {

            this.categorizedSets = await evaluatePage({
                ccScraperWindow : this.ccScraperWindow,
                dataObject : this.categorizedSet,
                resourceUri : url,
                uniquePropName : this.uniquePropName,
                closeOnEnd : false,
                saveDataOnFinish : false,
                noredirect : this.noredirect,
                selectedBrowserSignature : this.selectedBrowserSignature,
            });

            await this.saveData();
        }
        
    }

    async scrapeDataRecursively()   {
        /* 
        
            get the initial categorized sets;

            filter the ones that have startingPointUrls

            filter the ones with isStartingPoint property

            loop through them;
        
        */
    }

    async initialize()  {

    }

}

module.exports = CategorizedSetScraper;