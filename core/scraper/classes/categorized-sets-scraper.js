/* 

    // we initialize the scraper,
    // send the browser browser scraper class 
    // send the browser the 


*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, moderator, sendDataToMainProcess, isObjectInArray, slowDown } = require("../../../utilities");

class CategorizedSet {

    constructor({userDataPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd})    {

        if(!payload.ccScriptData.siteUrl && payload.ccScriptData.siteName)    {
            return null;
        }

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
        this.appObject = appObject && appObject.ready ? appObject : {ready : true};
        this.noredirect = false;
        this.selectedBrowserSignature = "chrome";

        this.maxRequestLimit = 50;

        this.siteUrl = payload.ccScriptData.siteUrl,
        this.siteName = payload.ccScriptData.siteName,

        this.setApiUrl();

        this.scraperInfo = {
            windowId : this.windowId,
            scraperType : this.payload.ccScraperData.scraperType,
        }

        

        // const { siteName, productBrand } = scraperOptions;

        // const {AppWindowId, browserWindowId, componentId} = browserWindowOptions;

        // this.siteName = siteName;
        
        // this.productBrand = productBrand;

        // this.siteUrl = siteUrl;

        // this.scraperOptions = scraperOptions;

    }

    setApiUrl() {
        let selectedApiEndpoint = "categorized-sets";

        this.apiUrl = `${this.serverUrl}/api/${selectedApiEndpoint}/create-multiple`;
    }

    clearUserData() {
        clearUserData();
    }

    // create the scraper window
    // load the correct script;
    // get the data;
    // then send data back to the main renderer;

}