/* 

    the main recieves an initiation from the user;
    then this create scraper window will spin a scraper based on the users request, categorized set scraper, product set scraper, single product scraper;


    user input
        site resource
        product brand
        categorized sets - this will have to go first so the user may have the option of getting the product sets; or all of them;

            all categories
        product sets
            selected product sets
        products;
            selected products;

*/

const { ipcRenderer } = require("electron");
const CcScraperWindow = require("../../classes/cc-scraper-window");
const { isFile } = require("../../../utilities");

module.exports = function(payload, appObject, callback = () => {})  {

    let {scraperWindowOptions, scraperOptions} = payload,
        {siteName, siteUrl} = payload,
        {AppWindowId, componentId, scraperWindowId, preloadedScript, url} = scraperWindowOptions,
        scraperWindow = new CcScraperWindow(AppWindowId, componentId, scraperWindowId, preloadedScript, url);


    

}