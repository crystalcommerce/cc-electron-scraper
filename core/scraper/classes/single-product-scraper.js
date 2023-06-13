/* 



    this function receives the payload
    payload has the scraperWindowOptions and scraperOptions;

    
    {fileNameWithExt, siteName, siteUrl} = scraperData
    {AppWindowId, componentId, windowId, resourceLocation} = scraperWindowOptions,
    
    

    C:\Users\cools\AppData\Roaming\cc-electron-scraper

*/

const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");

class SingleProductScraper {

    constructor({productObject, userDataPath, appAbsPath, serverUrl, payload, appObject})   {

        this.productObject = productObject;
        this.ccScraperWindow = null;
        this.evaluator = null;

        this.showWindow = false;

        this.userDataPath = userDataPath;
        this.appAbsPath = appAbsPath;
        this.serverUrl = serverUrl; 
        this.payload = payload;
        this.appObject = appObject && appObject.ready ? appObject : {ready : true};

    }

    async setScraperWindow()    {
        let { ccScraperWindow, evaluator } = await createScraperWindow(this.payload, this.userDataPath, this.appAbsPath, this.serverUrl, this.appObject);

        this.ccScraperWindow = ccScraperWindow;
        this.evaluator = evaluator;
    }

    async scrapeData()  {

        await evaluatePage({
            ccScraperWindow : this.ccScraperWindow,
            dataObject : this.productObject,
            uriPropName : this.evaluator.uriPropName,
            uniquePropName : "_id",
            closeOnEnd : true,
        });

        console.log({productObject : this.productObject});

        // Object.assign(this.productObject, productObject);

    }
    
    async initialize()  {

        await this.setScraperWindow();

        await this.scrapeData();
        
    }

}

module.exports = SingleProductScraper;