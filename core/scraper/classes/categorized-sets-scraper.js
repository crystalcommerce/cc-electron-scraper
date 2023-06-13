/* 

    // we initialize the scraper,
    // send the browser browser scraper class 
    // send the browser the 


*/
class CategorizedSet {

    constructor(siteUrl, evaluatorObject, scraperOptions, browserWindowOptions)    {
        const { siteName, productBrand } = scraperOptions;

        const {AppWindowId, browserWindowId, componentId} = browserWindowOptions;

        this.siteName = siteName;
        
        this.productBrand = productBrand;

        this.siteUrl = siteUrl;

        this.scraperOptions = scraperOptions;

    }

    // create the scraper window
    // load the correct script;
    // get the data;
    // then send data back to the main renderer;

}