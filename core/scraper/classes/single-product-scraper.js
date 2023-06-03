/* 



    this function receives the payload
    payload has the scraperWindowOptions and scraperOptions;

    
    {fileNameWithExt, siteName, siteUrl} = scraperData
    {AppWindowId, componentId, windowId, resourceLocation} = scraperWindowOptions,
    
    

    C:\Users\cools\AppData\Roaming\cc-electron-scraper

*/
const path = require("path");
const preloadedScript = require("../../../scripts");

class SingleProductScraper {

    constructor({userDataPath, serverUrl, productObject, productUriProp, scraperWindowOptions, scraperData})   {

        let {fileNameWithExt, siteName, siteUrl, fileName : routePath} = scraperData,
            {AppWindowId, componentId, windowId} = scraperWindowOptions;


        this.userDataPath = userDataPath;
        this.serverUrl = serverUrl;

        this.AppWindowId = AppWindowId;
        this.componentId = componentId;
        this.windowId = windowId;
        this.resourceLocation = productObject[productUriProp];
        this.scraperType = "single";
        this.scriptFilesPath = path.join(this.userDataPath, "modules", "scripts");
        this.preloadedScript = preloadedScript;
        this.evaluator = 
        

        this.productObject = productObject;

        
        this.apiRoute = `${serverUrl}/api/${routePath}`;
    
    }


    


}