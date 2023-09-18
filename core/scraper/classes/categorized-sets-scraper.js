/* 

    // we initialize the scraper,
    // send the browser browser scraper class 
    // send the browser the 


*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, moderator, sendDataToMainProcess, isObjectInArray, slowDown } = require("../../../utilities");

class CategorizedSetsScraper {

    constructor({userDataPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd})    {

        if(!payload.ccScriptData.siteUrl && payload.ccScriptData.siteName)    {
            return null;
        }

        this.AppWindowId = null;
        this.componentId = null;
        this.windowId = null;
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
        this.startingPointUrl = this.siteUrl;

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

        this.startingPointUrl = this.evaluator.startingPointUrl ? this.evaluator.startingPointUrl : this.startingPointUrl;
    }

    async scrapeData()  {

        if(this.evaluator.recursive)   {

            await this.scrapeDataRecursively();

            console.log(this.categorizedSets);

            // TODO: enable saving
            // await this.saveData();

        } else  {

            this.categorizedSets = await evaluatePage({
                ccScraperWindow : this.ccScraperWindow,
                dataObject : { siteUrl : this.siteUrl, siteName : this.siteName },
                resourceUri : this.startingPointUrl,
                closeOnEnd : false,
                saveDataOnFinish : false,
                noredirect : this.noredirect,
                selectedBrowserSignature : this.selectedBrowserSignature,
            });

            await this.saveData();
        }
        
    }

    replaceWithNewCategorizedSets(result) {
        
        let { prevCategorizedSet, newCategorizedSets } = result,
            foundIndex = null,
            foundCategorizedSet = this.categorizedSets.find((item, index) => {
                let result = item.startingPointUrl === prevCategorizedSet.startingPointUrl;

                if(result)  {
                    foundIndex = index;
                }

                return result;
            });

        if(newCategorizedSets.length) {
            if(foundIndex)  {
                this.categorizedSets.splice(foundIndex, 1, ...newCategorizedSets);
            }
        } else  {

            foundCategorizedSet.isStartingPoint = true;

        }

    }


    async recursiveScraping(filteredCategorizedSets)    {

        if(!filteredCategorizedSets.length)  {

            await this.ccScraperWindow.close();

            return;
        }

        await moderator(filteredCategorizedSets, async (slicedArr) => {

            let { ccScraperWindow } = await createScraperWindow(this.payload, this.userDataPath, this.serverUrl, this.appObject),       
                [categorizedSet] = slicedArr,
                scrapingResult = await evaluatePage({
                    ccScraperWindow, // should be changed...
                    dataObject : categorizedSet,
                    resourceUri : categorizedSet.startingPointUrl,
                    closeOnEnd : true,
                    saveDataOnFinish : false,
                    noredirect : this.noredirect,
                    selectedBrowserSignature : this.selectedBrowserSignature,
                }),
                newCategorizedSets = scrapingResult.categorizedSet ? scrapingResult.categorizedSet : [];

            this.replaceWithNewCategorizedSets({
                prevCategorizedSet : categorizedSet,
                newCategorizedSets,
            });

        }, 5);

        filteredCategorizedSets = this.categorizedSets.filter(item => !item.isStartingPoint);

        await this.recursiveScraping(filteredCategorizedSets);
        
    }


    async scrapeDataRecursively()   {
        /* 
        
            get the initial categorized sets;

            filter the ones that have startingPointUrls

            filter the ones with isStartingPoint property

            loop through them;
        
        */

        if(this.categorizedSets.length) {

            let filteredCategorizedSets = this.categorizedSets.filter(item => !item.isStartingPoint);

            await this.recursiveScraping(filteredCategorizedSets);

        } else  {
            // initial categorizedSets scraping...
            this.categorizedSets = await evaluatePage({
                ccScraperWindow : this.ccScraperWindow,
                dataObject : { siteUrl : this.siteUrl, siteName : this.siteName },
                resourceUri : this.startingPointUrl,
                closeOnEnd : true,
                saveDataOnFinish : false,
                noredirect : this.noredirect,
                selectedBrowserSignature : this.selectedBrowserSignature,
            });

            await this.scrapeDataRecursively();

        }
    }

    async initialize()  {

        await this.setScraperWindow();

        // TODO: hide window...
        this.ccScraperWindow.showWindow(); // this is just temporary

        await this.scrapeData();

    }

}

module.exports = CategorizedSetsScraper;