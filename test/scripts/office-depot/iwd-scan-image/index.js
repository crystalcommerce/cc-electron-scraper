const scanScrapedImages = require('../../../../core/scraper/api/scan-scraped-images');

module.exports = async function(currentPage = 1)   {

    await scanScrapedImages({
        serverUrl : "http://localhost:7000", 
        apiEndpoint : "office-depots", 
        filter : {}, 
        currentPage, 
        limit : 5
    });
    
}