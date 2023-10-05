/* 

    Single product scraping...

*/

const clearUserData = require("../../../electron/api/scraper-window/clear-user-data");
const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
const { apiRequest, sendDataToMainProcess } = require("../../../utilities");

class SingleProductScraper {

    constructor({productObject, userDataPath, serverUrl, payload, appObject, saveDataOnFinish, closeOnEnd, evaluatorIndex, ccScraperWindow})   {

        if(!productObject)  {
            return null;
        }

        this.AppWindowId = null;
        this.componentId = null;
        this.windowId = ccScraperWindow ? ccScraperWindow.windowId : null;
        this.saveDataOnFinish = typeof saveDataOnFinish === "boolean" ? saveDataOnFinish : true;
        this.closeOnEnd = typeof closeOnEnd === "boolean" ? closeOnEnd : true;
        this.evalautorIndex = typeof evaluatorIndex === "number" ? evaluatorIndex : 0;

        this.productObject = productObject;
        this.ccScraperWindow = ccScraperWindow ? ccScraperWindow : null;
        this.evaluator = null;

        this.showWindow = true;

        this.userDataPath = userDataPath;
        this.serverUrl = serverUrl; 
        this.apiUrl = null;
        this.payload = payload;
        this.appObject = appObject && appObject.ready ? appObject : {ready : true};
        this.idPropName = "_id";
        this.noredirect = true;
        this.selectedBrowserSignature = "chrome";
        
        this.setApiUrl(payload);

    }

    getScraperInfo()    {
        return {
            AppWindowId : this.AppWindowId,
            componentId : this.componentId,
            windowId : this.windowId,
            scraperType : this.payload.ccScraperData.scraperType,
            evaluatorIndex : this.evaluatorIndex
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

    async saveData()  {

        try {

            let productId = this.productObject[this.idPropName],
                updateUrl = `${this.apiUrl}/${productId}`,
                updateResult = await apiRequest(updateUrl, {
                    method : "PUT",
                    body : JSON.stringify(this.productObject),
                    headers : {
                        "Content-Type" : "application/json",
                    }
                }, true);

            sendDataToMainProcess("scraper-window", {...this.scraperInfo, data : updateResult});
            
            if(updateResult.status === 200) {
                return updateResult;
            }

        } catch(err)    {
            console.log({
                message : `Error in updating product to db : ${err.message}; \nproductObject : ${this.productObject}`,
                type : "DB Update Document Error",
                statusOk : false,
            });
        }

    }

    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.serverUrl, this.appObject, this.evaluatorIndex);

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
            noredirect : this.noredirect,
            selectedBrowserSignature : this.selectedBrowserSignature,
        });

        // console.log({ dataObject, productObject : this.productObject });

        Object.assign(this.productObject, dataObject);

    }
    
    async initialize()  {

        await this.setScraperWindow();

        // TODO: hide window...
        this.ccScraperWindow.showWindow();

        await this.scrapeData();

        if(this.saveDataOnFinish)   {

            await this.saveData();

        }
        
    }

}

module.exports = SingleProductScraper;