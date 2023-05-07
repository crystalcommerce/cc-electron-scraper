const StandardScraperScript = require("./standard-scraper");
const puppeteer = require("puppeteer");
const path = require("path");
const { createDirPath, toUrl } = require("../../../utilities");

class CategorizedScraperScript {

    constructor(startingPointUri, categoryEvluatorObjects, scraperOptions)    {
        const { siteName, productBrand } = scraperOptions;

        this.siteName = siteName;
        this.productBrand = productBrand;

        this.scraperOptions = scraperOptions;

        this.startingPointUri = startingPointUri;

        this.categoryEvluatorObjects = categoryEvluatorObjects;

        this.dataDirPath;

        this.browserOptions = {
            headless : false,
            height : 900,
            width : 1440,
        };
        this.bulkScrapingOptions = {
            bulkCount : 5,
            maxBatchCount : 100,
            timeDelay : 25000,
            maximumUnscrapedData : 5,
            recursionTimes : 5,
            recursive : true,
        };
    }

    getDirNameArr(...args) {
        let dirArr = [this.siteName, this.productBrand];
        dirArr.push(...args);
        return dirArr.filter(dirName => dirName && dirName.trim() !== "").map(dirName => toUrl(dirName));
    }

    async createDataDirPath() {
        let dirNameArr = this.getDirNameArr();
        this.dataDirPath = await createDirPath("data", ...dirNameArr);
    }  

    async getAllCategories(categoryEvluatorObject) {
        let { headless, height, width } = this.browserOptions,
            browser = await puppeteer.launch({headless}),
            page = await browser.newPage(),
            { callback, waitMethods } = categoryEvluatorObject;

        // recursive function;
        const getCategories = async (parentDirPath, url) => {
            await page.setViewport({height, width});
            await page.goto(url, {waitUntil : "networkidle0", timeout : 0});
            
            if(waitMethods.length)  {
                for(let waitMethod of waitMethods)    {
                    await page[waitMethod.name](waitMethod.args);
                }
            }

            let categoryObjects = await page.evaluate(callback);

            if(categoryObjects.length)  {
                
                for(let catObject of categoryObjects)   {
                    let { url : newUrl, name } = catObject,
                    newDirPath = await createDirPath(parentDirPath, toUrl(name));

                    await getCategories(newDirPath, newUrl);
                }
            } else  {
                
                this.scraperOptions.productsListEvaluatorUris = [
                    { url, evaluatorIndex : 0, }, 
                ];
                this.scraperOptions.productSet = path.basename(parentDirPath);
                this.scraperOptions.evaluatorArgs = [
                    {   
                        evaluatorIndex : 0,
                        args : [],
                    },
                ];

                let scraperScript = new StandardScraperScript(this.scraperOptions);

                // await scraperScript.createDataDirPath();
                scraperScript.dataDirPath = path.join(process.cwd(), parentDirPath);
                scraperScript.bulkScrapingOptions = this.bulkScrapingOptions;


                // // executeEvaluatorsAll
                await scraperScript.executeEvaluators();

                // // bulk image downloading...
                await scraperScript.downloadImagesByBulk();

                await scraperScript.writeProductObjectsToCsv();
            }
           
        }

        await this.createDataDirPath();

        await getCategories(this.dataDirPath, this.startingPointUri);
        

        browser.close();
    }

}

module.exports = CategorizedScraperScript;