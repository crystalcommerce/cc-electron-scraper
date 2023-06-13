const SingleProductScraper = require("../core/scraper/classes/single-product-scraper");
const createScraperWindow = require("../electron/api/scraper-window/create-scraper-window");
const evaluatePage = require("../electron/api/scraper-window/evaluate-page");
const CcScraperWindow = require("../electron/classes/cc-scraper-window");
const { moderator } = require("../utilities");


module.exports = async function(productObjects, payload, userDataPath, appAbsPath, serverUrl)   {

    await moderator(productObjects, async (slicedArr) => {

        let promises = slicedArr.map((productObject, index) => {
            return async function() {
                
                // let { ccScraperWindow, evaluator } = await createScraperWindow(
                //     payload,
                //     userDataPath,
                //     appAbsPath,
                //     serverUrl,
                //     { ready : true }
                // );

                // ccScraperWindow.showWindow();
                
                // await evaluatePage({
                //     ccScraperWindow, 
                //     productObject, 
                //     uriPropName : evaluator.uriPropName, 
                //     uniquePropName : "id", 
                //     closeOnEnd : true
                // });

                let singleProductScraper = new SingleProductScraper({productObject, userDataPath, appAbsPath, serverUrl, payload });

                await singleProductScraper.initialize();

                console.log(singleProductScraper.productObject);

            }
        });

        await Promise.all(promises.map(item => item()));

    }, CcScraperWindow.maxOpenedWindows);

    // let promises = scraperWindows.map(item => () => item.close());

    // await Promise.all(promises.map(item => item()));

    console.log(productObjects);
}