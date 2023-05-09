const { ipcRenderer } = reqruire("electron");
const { timedReload } = require("../../../utilities");


class Scraper    {

    constructor({browserWindowId, siteResource, evaluatorObject, scraperType})    {
        this.browserWindowId = browserWindowId;
        this.siteResource = siteResource;
        this.scraperType = scraperType; // categorizedSet || productSet || singleProduct;
        
        if(!evaluatorObject)    {
            return;
        }

        this.evaluatorObject = evaluatorObject;
    }

    async waitForSelectors()  {
        
    }

    async scrapeData()    {

    }

    sendData(data) {

    }

}