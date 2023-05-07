const puppeteer = require("puppeteer");
const path = require("path");
const { createDirPath, toUrl } = require("../../../utilities");
const fileDownloader = require("../file-downloader");
const csvDataWriter = require("../csv-data-writer");



class ScraperScript {

    constructor(scraperOptions)    {
        const {
            productListUrl,
            siteResource, 
            productSet,
            productUrlProps,
            paginated,
            evaluatorObjects,
            imagePropName,
            imageNameObject,
            csvExcludedProps,
            initialEvaluatorArgs,
        } = scraperOptions;

        this.productListUrl = productListUrl;
        this.siteResource = siteResource;
        this.productBrand = this.siteResource.productBrand;
        this.productSet = productSet;
        this.productUrlProps = productUrlProps;
        this.paginated = paginated;
        this.evaluatorObjects = evaluatorObjects;
        this.imagePropName = imagePropName;
        this.imageNameObject = imageNameObject;
        this.csvExcludedProps = csvExcludedProps;
        this.initialEvaluatorArgs = initialEvaluatorArgs;
        

        this.dataDirPath; 
        this.scriptsDirPath; 
        this.csvFileName;
        this.unscrapedData = [];
        this.productObjects = [];

        this.browserOptions = {
            headless : false,
            height : 900,
            width : 1440,
        },
        this.bulkScrapingOptions = {
            bulkCount : 5,
            maxBatchCount : 100,
            timeDelay : 25000,
            maximumUnscrapedData : 5,
            recursionTimes : 5,
            recursive : true,
        }
        this.initialEvaluator;
        this.evaluatorIndex;
    }

    getDirNameArr(...args) {
        let dirArr = [this.siteResource.siteName, this.productBrand, this.productSet];
        dirArr.push(...args);
        return dirArr.filter(dirName => dirName && dirName.trim() !== "").map(dirName => toUrl(dirName));
    }

    getDataRelativePath(...args)   {
        let dirNameArr = this.getDirNameArr(...args);

        return path.join("data", ...dirNameArr);
    }

    getImagePath(imageDirPath)  {
        return imageDirPath.slice(imageDirPath.indexOf("data"));
    }

    async createDataDirPath() {
        let dirNameArr = this.getDirNameArr();
        this.dataDirPath = await createDirPath("data", ...dirNameArr);
    }

    async createScriptsDirPath() {
        let dirNameArr = this.getDirNameArr();
        this.scriptsDirPath = await createDirPath("data", ...dirNameArr);
    }

    getInitialEvaluator()   {
        this.initialEvaluator = this.evaluatorObjects[0];
        this.evaluatorObjects.shift();
    }

    async evaluateProductsListPaginated() {
        let { headless, height, width } = this.browserOptions,
            browser = await puppeteer.launch({headless}),
            page = await browser.newPage(),
            {callback, args, waitMethods} = this.initialEvaluator(this.initialEvaluatorArgs);

        const getProductObjects = async (page, url) => {
    
            await page.setViewport({height, width});
            await page.goto(url, {waitUntil : "networkidle0", timeout : 0});
            if(waitMethods.length)  {
                for(let waitMethod of waitMethods)    {
                    await page[waitMethod.name](waitMethod.args);
                }
            }
    
    
            let { productObjects, newUrl } = await page.evaluate(callback, ...args);
            
    
            this.productObjects.push(...productObjects);
            
            if(newUrl)  {

                await getProductObjects(page, newUrl);
            }
        }
            
        await getProductObjects(page, this.productListUrl);
    
        browser.close();

    }

    async evaluateProductsList()  {
        let browser = await puppeteer.launch({headless : this.browserOptions.headless}),
            page = await browser.newPage(),
            {callback, args, waitMethods} = this.initialEvaluator(this.initialEvaluatorArgs);
            
        await page.setViewport({height : this.browserOptions.height, width : this.browserOptions.width});
        await page.goto(this.productListUrl, {waitUntil : "networkidle0", timeout : 0});
        if(waitMethods.length)  {
            for(let i = 0; i < waitMethods.length; i++)    {
                let waitMethod = waitMethods[i];
                await page[waitMethod.name](waitMethod.args);
            }
        }

        let productObjects = await page.evaluate(callback, ...args);

        browser.close();
        
        this.productObjects.push(...productObjects);
    }

    async initialProductsListEvaluation()   {
        if(this.paginated)  {
            await this.evaluateProductsListPaginated();
        } else  {
            await this.evaluateProductsList();
        }     
    }

    async evaluateSingleProductPage(page, productObject, evaluatorObject)   {
        let {callback, waitMethods, objPropArgs} = evaluatorObject,
            args = function()   {
                let args = [];

                for(let prop of objPropArgs)    {
                    args.push(productObject[prop]);
                }

                return args;
            }(),
            { height, width } = this.browserOptions;

        await page.setViewport({ height, width });
        await page.goto(productObject[this.productUrlProps[this.evaluatorIndex]], {waitUntil : "networkidle0", timeout : 0});
        if(waitMethods.length)  {
            for(let waitMethod of waitMethods)    {
                await page[waitMethod.name](waitMethod.args);
            }
        }

        let productObjectProps = await page.evaluate(callback, ...args);

        for(let key in productObjectProps)    {
            productObject[key] = productObjectProps[key];
        }
    }

    async scrapeProductDetailsByBulk(productObjects, evaluatorObject, bulkCount = 5, i = 0) {
        let pageInstances = [],
            browserInstances = [];

        await new Promise(async resolve => {
            let min = bulkCount < productObjects.length ? bulkCount : productObjects.length;

            for(let i = 0; i < min; i++)  {
                let browser = await puppeteer.launch({headless : this.browserOptions.headless}),
                    page = await browser.newPage();
                pageInstances.push(page);
                browserInstances.push(browser);
            }
            resolve();
        });
        

        const getProductDetailsByBulk = async (bulkCount, i) => {
            let promises = [],
                counter = bulkCount + i < productObjects.length ? bulkCount + i : productObjects.length;
            
            while(i < counter)  {
                
                let pageCounter = i - (counter - bulkCount),
                    page = pageInstances[pageCounter];
                
                console.log({pageCounter, counter, i, total : productObjects.length});
                promises.push(await this.evaluateSingleProductPage.bind(this, page, productObjects[i], evaluatorObject));
                i++;
            }

            await Promise.all(promises.map(async (item, index) => {
                let currentIndex = (counter + index) - promises.length;
                try {
                    await item();
                    console.log(currentIndex)
                } catch (err)   {
                    console.log({
                        err,
                        currentIndex,
                    });
                    this.unscrapedData.push(productObjects[currentIndex]);
                }
            }));
            

            if(i < productObjects.length)    {
                await getProductDetailsByBulk(bulkCount, i);
            }
        }

        await getProductDetailsByBulk(bulkCount, i);


        // closing page and browser instances;
        for(let page of pageInstances)  {
            await page.close();
        }

        for(let browser of browserInstances)    {
            await browser.close();
        }

    }

    async controlledBulkProductDetailsScraping(evaluatorObject, productObjects = null, bulkCount = 5, i = 0)    {
        let max = this.bulkScrapingOptions.maxBatchCount,
            objCount = this.productObjects.length,
            allProducts = productObjects ? productObjects : this.productObjects;

        if(objCount < max)  {
            await this.scrapeProductDetailsByBulk(allProducts, evaluatorObject, bulkCount, i);
    
            
        } else  {
    
            let divisions = Math.ceil(objCount / max),
                count = 0;
    
            while(count < divisions)    {
    
                let firstIndex = count * max,
                    lastIndex = (count + 1) * max < objCount ? (count + 1) * max : objCount;

                await this.scrapeProductDetailsByBulk(allProducts.slice(firstIndex, lastIndex), evaluatorObject, bulkCount, i);
    
    
                count++;
            }
        }
    
    }

    async scrapeAllData(evaluatorObject, recursive = false)   {

        let recursionTimes = 0;

        const getAllProducts = async (productObjects) => {

            await this.controlledBulkProductDetailsScraping(evaluatorObject, productObjects, this.bulkScrapingOptions.bulkCount, 0);

            recursionTimes++;

            if(recursive && (this.unscrapedData.length > 5 && recursionTimes < this.bulkScrapingOptions.recursionTimes))   {
                console.log(`We have ${this.unscrapedData.length} rows of unscraped data... We are rescraping the data.`);
                console.table(this.unscrapedData);

                let unscrapedDataCopy = [...this.unscrapedData];
                this.unscrapedData = [];

                await new Promise(resolve => {
                    setTimeout(async () => {
                        await getAllProducts(unscrapedDataCopy);
                        resolve();
                    }, this.bulkScrapingOptions.timeDelay);
                })
                
                
            }
        }
        
        await getAllProducts(this.productObjects);

    }

    async executeEvaluators()   {

        for(let i = 0; i < this.evaluatorObjects.length; i++) {
            let evaluatorObject = this.evaluatorObjects[i];
            this.evaluatorIndex = i;

            await this.scrapeAllData(evaluatorObject, this.bulkScrapingOptions.recursive);
            
        }

    }

    async downloadImage(productObject, imageDirPath, i)   {

        let imageNames = [],
            imagePaths = [],
            {imageUris} = productObject,
            {shared, split} = this.imageNameObject,
            splitNames = function()    {
                let names = [];
                for(let prop of split) {
                    names.push(productObject[prop]);
                }
                return names;
            }(),
            sharedNames = function()    {
                let names = [];
                for(let prop of shared) {
                    productObject[prop] && names.push(productObject[prop]);
                }
                return names;
            }();
            
        for(let j = 0; j < imageUris.length; j++)   {

            let nm = splitNames.reduce((a, b) => {
                    a += b.split("//").map(item => item.trim())[j];
                    return a;
                }, ""),
                imageName = toUrl([`${i + 1} ${j + 1}`, nm, ...sharedNames].join(" ")),
                imageUri = imageUris[j];


            try {
                let downloadResult = await fileDownloader(imageUri, imageName, imageDirPath, null, ".jpg"),
                    {fileName, status} = downloadResult,
                    imagePath = `/${this.getImagePath(imageDirPath)}/${fileName}`; /* Currently working on this... */
        
                if(!status)    {
                    throw Error("image not found");
                }
                imageNames.push(fileName);
                imagePaths.push(imagePath);
                
                console.log(downloadResult);
            } catch(err)    {
                imageNames.push("NO IMAGE DOWNLOADED.");
                console.log("we couldn't download the image: " + err.message);
                console.log(err);
            }
        }

        productObject[this.imagePropName] = imageNames.join(" // ");
        productObject.imagePaths = imagePaths.map(item => item.replace(/\\+/g, "/"));
        
    }

    async downloadImagesByBulk(subDirName = null, bulkCount = 70, i = 0) {

        let imageDirPath = await createDirPath(this.dataDirPath, `${subDirName ? `${subDirName}/images` : `images`}`);

        const downloadByBulk = async(bulkCount, i) => {
            let promises = [],
                counter = bulkCount + i < this.productObjects.length ? bulkCount + i : this.productObjects.length;
            
            while(i < counter)  {
                
                promises.push(await this.downloadImage.bind(this, this.productObjects[i], imageDirPath, i));

                i++;
            }

            await Promise.all(promises.map(async item => await item()));
            if(i < this.productObjects.length)    {
                await downloadByBulk(bulkCount, i);
            }
        }
        
        await downloadByBulk(bulkCount, i);

    }

    async writeProductObjectsToCsv(subDirName = null)    {
        await this.createDataDirPath();
        let dirPath = subDirName ? await createDirPath(this.dataDirPath, subDirName) : this.dataDirPath;

        this.csvFileName = this.getDirNameArr(subDirName).join("-");
        await csvDataWriter(dirPath, this.csvFileName, this.productObjects, [...this.csvExcludedProps, "imagePaths"], true);
        await csvDataWriter(dirPath, `UNSCRAPED-DATA-${this.csvFileName}`, this.unscrapedData, [], true);
    }

}

module.exports = ScraperScript;