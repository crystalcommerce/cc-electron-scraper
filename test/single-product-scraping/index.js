const path = require("path");
const CcScraperWindow = require('../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile } = require('../../utilities');
const batchScrapingMethodSingleProduct = require('./batch-scraping-method-single-product');


module.exports = async function(app)   {
    let categorizedSetId = generateUuid(), //TODO :  create custom categorized set for products that only had url;
        /* 

            categorizedSet will be search through the categorizedSets;

            then categorizedSets will be added to each of the productObjects;
        
        */
        productObjects = [
            {   
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-diamond-coin-purse-belt-bag-quilted-caviar-2104371",
                categorizedSetId
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-bum-bag-monogram-empreinte-leather-2154811",
                categorizedSetId
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-bottega-veneta-drawstring-handle-bag-outlet-embellished-intrecciato-nappa-medium2158401",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-gucci-soho-chain-strap-shoulder-bag-leather-mini2158411",
                categorizedSetId
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-popincourt-nm-handbag-monogram-canvas-pm213484144",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-speedy-handbag-monogram-canvas-252148411",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-open-shopping-tote-quilted-lambskin-large2165231",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-fendi-peekaboo-bag-leather-micro2162241",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-filigree-double-zip-clutch-with-chain-quilted-caviar-2170581",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-loewe-balloon-bucket-bag-leather-nano2162521",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-boy-flap-bag-quilted-caviar-old-medium2162201",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-saint-laurent-classic-monogram-envelope-satchel-mixed-matelasse-leather-medium2163711",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-saint-laurent-classic-monogram-envelope-satchel-mixed-matelasse-leather-large2161351",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-saint-laurent-rive-gauche-shopper-tote-canvas-tall2160441",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-prada-double-zip-lux-tote-saffiano-leather-medium2160144",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-19-flap-bag-quilted-leather-medium2159521",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-salvatore-ferragamo-studio-satchel-leather-small2164551",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-balenciaga-city-giant-studs-bag-leather-mini2164182",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-fendi-3jours-bag-leather-mini2159501",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-reissue-255-flap-bag-quilted-caviar-2262159191",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-chanel-my-everything-flap-card-holder-belt-bag-quilted-caviar-2170602",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-louis-vuitton-cluny-top-handle-bag-epi-leather-mm2162541",
                categorizedSetId,
            },
            {
                
                productUri : "https://shop.rebag.com/products/handbags-celine-triomphe-east-west-shoulder-bag-smooth-calfskin-2158463",
                categorizedSetId,
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
            

        await batchScrapingMethodSingleProduct(productObjects.slice(0,3), payload, userDataPath, appAbsPath, serverUrl);

    });


    app.on('window-all-closed', (e) => {

        console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, productObjects : productObjects.slice(0,3)})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}

