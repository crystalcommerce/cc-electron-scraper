const categorizedSetScraper = require("./categorized-set-scraper");
const iwdScanImage = require("./iwd-scan-image");
const printDataToCsv = require("./print-data-to-csv");
const productSetScraper = require("./product-set-scraper");
const singleProductScraper = require("./single-product-scraper");



module.exports = async function(app, ipcMain)   {


    // await categorizedSetScraper(app, ipcMain);

    // await productSetScraper(app, ipcMain);

    // await singleProductScraper(app, ipcMain);

    await iwdScanImage(app);

    await printDataToCsv(app);

}