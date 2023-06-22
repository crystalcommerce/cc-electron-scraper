/* 

    Single product scraping...

*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, sendDataToMainProcess } = require("../../../utilities");

class SingleProductScraper {

    constructor({productObject, userDataPath, appAbsPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd, evaluatorIndex, ccScraperWindow})   {

        if(!productObject)  {
            return null;
        }

        this.windowId = ccScraperWindow ? ccScraperWindow.windowId : null;
        this.saveDataOnFinish = typeof saveDataOnFinish === "boolean" ? saveDataOnFinish : true;
        this.closeOnEnd = typeof closeOnEnd === "boolean" ? closeOnEnd : true;
        this.evalautorIndex = typeof evaluatorIndex === "number" ? evaluatorIndex : 0;

        this.productObject = productObject;
        this.ccScraperWindow = ccScraperWindow ? ccScraperWindow : null;
        this.evaluator = null;

        this.showWindow = true;

        this.userDataPath = userDataPath;
        this.appAbsPath = appAbsPath;
        this.serverUrl = serverUrl; 
        this.apiUrl = null;
        this.payload = payload;
        this.appObject = appObject && appObject.ready ? appObject : {ready : true};
        
        this.setApiUrl(payload);

        this.scraperInfo = {
            windowId : this.windowId,
            scraperType : "single-product-scraping",
            evaluatorIndex : this.evaluatorIndex
        }

    }

    setApiUrl(payload) {
        let { ccScriptData } = payload,
            { fileName } = ccScriptData;

        this.apiUrl = `${this.serverUrl}/api/${fileName}`;
    }

    clearUserData() {
        clearUserData();
    }

    async saveData()  {

        try {

            let createResult = await apiRequest(this.apiUrl, {
                method : "POST",
                body : JSON.stringify(this.productObject),
                headers : {
                    "Content-Type" : "application/json",
                }
            }, true);

            sendDataToMainProcess({...this.scraperInfo}, createResult);
            
            if(createResult.status === 200) {
                return createResult;
            }

        } catch(err)    {
            console.log(err);
        }

    }

    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.appAbsPath, this.serverUrl, this.appObject, this.evaluatorIndex);

        // setting other properties of this instance;
        this.ccScraperWindow = ccScraperWindow;
        this.windowId = this.ccScraperWindow.windowId;
        this.evaluator = evaluator;
    }

    async scrapeData()  {

        let dataObject = await evaluatePage({
            ccScraperWindow : this.ccScraperWindow,
            dataObject : this.productObject,
            uriPropName : this.evaluator.uriPropName,
            closeOnEnd : this.closeOnEnd,
        });

        console.log({ dataObject, productObject : this.productObject });

        Object.assign(this.productObject, dataObject);

    }
    
    async initialize()  {

        await this.setScraperWindow();

        this.ccScraperWindow.showWindow(); // this is just temporary

        await this.scrapeData();

        if(this.saveDataOnFinish)   {

            await this.saveData();

        }
        
    }

}

module.exports = SingleProductScraper;