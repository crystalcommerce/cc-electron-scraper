class ApiScraper    {

    constructor({serverUrl, payload, appObject})    {

        this.AppWindowId = null;

        this.serverUrl = serverUrl; 
        this.apiUrl = null;
        this.payload = payload;
        this.scriptData = this.payload.ccScriptData;
        this.scraperData = this.payload.ccScraperData;

        this.siteUrl = payload.ccScriptData.siteUrl;
        this.siteName = payload.ccScriptData.siteName;

        this.appObject = appObject && appObject.ready ? appObject : {ready : true};

        this.maxRequestLimit = 50;

        this.categorizedSets = [];

        this.setApiUrl();

        this.timeStart = Date.now();

    }

    setApiUrl() {
        
    }

    async saveData()  {

    }

    async scrapeData()    {

    }

    async initialize()    {

    }

}

module.exports = ApiScraper;