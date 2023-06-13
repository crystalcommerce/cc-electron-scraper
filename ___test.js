const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const CcScraperWindow = require('./electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile } = require('./utilities');
const createPreloadedScript = require('./core/scraper/api/create-preloaded-script');
const getPreloadedScript = require('./core/scraper/api/get-preloaded-script');
const createScraperWindow = require('./electron/api/scraper-window/create-scraper-window');
const evaluatePage = require('./electron/api/scraper-window/evaluate-page');
const batchScrapingMethod = require('./test/batch-scraping-method');
const session = require('electron').session;


let productObjects = [
    {   
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-diamond-coin-purse-belt-bag-quilted-caviar-2104371"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-bum-bag-monogram-empreinte-leather-2154811"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-bottega-veneta-drawstring-handle-bag-outlet-embellished-intrecciato-nappa-medium2158401"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-gucci-soho-chain-strap-shoulder-bag-leather-mini2158411"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-popincourt-nm-handbag-monogram-canvas-pm213484144"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-speedy-handbag-monogram-canvas-252148411"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-open-shopping-tote-quilted-lambskin-large2165231"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-fendi-peekaboo-bag-leather-micro2162241"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-filigree-double-zip-clutch-with-chain-quilted-caviar-2170581"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-loewe-balloon-bucket-bag-leather-nano2162521"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-boy-flap-bag-quilted-caviar-old-medium2162201"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-saint-laurent-classic-monogram-envelope-satchel-mixed-matelasse-leather-medium2163711"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-saint-laurent-classic-monogram-envelope-satchel-mixed-matelasse-leather-large2161351"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-saint-laurent-rive-gauche-shopper-tote-canvas-tall2160441"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-prada-double-zip-lux-tote-saffiano-leather-medium2160144"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-19-flap-bag-quilted-leather-medium2159521"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-salvatore-ferragamo-studio-satchel-leather-small2164551"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-balenciaga-city-giant-studs-bag-leather-mini2164182"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-fendi-3jours-bag-leather-mini2159501"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-reissue-255-flap-bag-quilted-caviar-2262159191"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-chanel-my-everything-flap-card-holder-belt-bag-quilted-caviar-2170602"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-cluny-top-handle-bag-epi-leather-mm2162541"
    },
    {
        "_id" : generateUuid(),
        productUri : "https://shop.rebag.com/products/handbags-celine-triomphe-east-west-shoulder-bag-smooth-calfskin-2158463"
    },

];


app.whenReady().then(async () => {

    let payload = {
            ccScriptData : {
                fileName : "rebag-bags",
            },
            ccScraperData : {
                AppWindowId : null,
                componentId : null,
                scraperType : "single",
            },
        },
        appAbsPath = app.getAppPath(),
        userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
        serverUrl = "http://localhost:7000";
        

    await batchScrapingMethod(productObjects, payload, userDataPath, appAbsPath, serverUrl);

});


app.on('window-all-closed', (e) => {

    console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, productObjects})
    // e.preventDefault();
    // if (process.platform !== 'darwin') {
    //     app.quit()
    // }
});