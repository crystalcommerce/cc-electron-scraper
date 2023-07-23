const scanScrapedImages = require('../../../../core/scraper/api/scan-scraped-images');

module.exports = async function(app, ipcMain, currentPage = 1)   {

    await scanScrapedImages({
        app, 
        ipcMain,
        serverUrl : "http://localhost:7000", 
        apiEndpoint : "grainger-packaging-and-shipping-supplies", 
        filter : {}, 
        currentPage, 
        limit : 5
    });
    
}