/* 

    create an array of the categorizedSets

    then replace the array item of the categorized set with the children found;

    if no children found... mark the item as isStartingPointUrl : true;

    if its children mark them with parentUrl with the parent's url;

    add additional category tags with the labels found in their url;

    then find the item in the main categorized sets and replace that with the new items;


*/

// const 
const categorizedSetScraper = require("./categorized-set-scraper");
const { createDirPath, createJsonFileObject, apiRequest, moderator } = require("../../../utilities");
const productSetsScraper = require("./product-sets-scraper");
const singleProductScraper = require("./single-product-scraper");
const imageCheckerAndUriUpdater = require("./image-checker-and-uri-updater");
const imageWatermarkChecker = require("./image-watermark-checker");
const printDataToCsv = require("./print-data-to-csv");


module.exports = async function(app, ipcMain)    {
    
    await categorizedSetScraper(app, ipcMain);

    // await productSetScraping(app, ipcMain);

    // await singleProductScraper(app, ipcMain, 1);

    // await imageCheckerAndUriUpdater();

    // await imageWatermarkChecker(1);

    // printDataToCsv(app, ipcMain);


}
