const categorizedSetScraper = require("./categorized-set-scraper");
const iwdScanImage = require("./iwd-scan-image");
const printDataToCsv = require("./print-data-to-csv");
const productSetScraper = require("./product-set-scraper");
const singleProductScraper = require("./single-product-scraper");



module.exports = async function(app, ipcMain)   {


    app.whenReady().then(async () => {

        // await categorizedSetScraper(app, ipcMain);

        await productSetScraper(app, ipcMain, 37);

        // await singleProductScraper(app, ipcMain, 2651);

        // await iwdScanImage(app, ipcMain, 1);

        // await printDataToCsv(app, ipcMain);


        app.quit();

    });

    app.on('window-all-closed', (e) => {

        e.preventDefault();

    });
    
}