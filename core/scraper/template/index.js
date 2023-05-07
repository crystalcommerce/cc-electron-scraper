const path = require("path");
const { createDirPath, toUrl } = require("../../../utilities");
const csvDataWriter = require("../csv-data-writer");
const bulkImageDownloader = require("./bulk-image-downloader");
const downloadImage = require("./download-image");


module.exports = async function(scraperOptions)  {

    // const {
    //     productListUrl,
    //     siteResource, 
    //     productBrand, 
    //     productSet,
    //     productUrlProp,
    //     paginated,
    //     evaluatorObjects,
    //     imagePropName,
    //     imageNameObject,
    //     csvExcludedProps,
    // } = scraperOptions;

    // let validDirName = [siteResource.siteName, productBrand, productSet].filter(dirName => dirName && dirName.trim() !== "").map(dirName => toUrl(dirName)),
    //     csvFileName = `${toUrl(siteResource.siteName)}-${validDirName.join("-")}`,
    //     dirPath = await createDirPath(process.cwd(), "data", ...validDirName),
    //     [initialEvaluator] = evaluatorObjects,
    //     unscrapedData = [];
        
    // // removing the initialEvaluator;
    // evaluatorObjects.shift();

    // let productListEvaluator = paginated ? pageEvaluatorProductsListPaginated : pageEvaluatorProductsList,
    //     productObjects = await productListEvaluator(productListUrl, initialEvaluator);

    //     // productObjects = productObjects.slice(15, 20);
    
    // // scrape data based on the entered steps;
    // for(let i = 0; i < evaluatorObjects.length; i++) {
    //     let evaluatorObject = evaluatorObjects[i],
    //         unscrapedObjects = await bulkProductDetailsScraper(productObjects, pageEvaluatorSingleProduct, evaluatorObject, productUrlProp);
        
    //     unscrapedData.push(...unscrapedObjects);
    // }

    // console.table(productObjects);
    // console.table(unscrapedData);
    


    // // download images;
    // await bulkImageDownloader(dirPath, productObjects, downloadImage, imagePropName, imageNameObject);

    // await csvDataWriter(dirPath, csvFileName, productObjects, [...csvExcludedProps]);
    

    // return {
    //     productObjects,
    //     unscrapedData,
    //     writeDataToCsv : async () => await csvDataWriter(dirPath, csvFileName, productObjects, [...csvExcludedProps], true),
    //     writeUnscrapedDataToCsv : async () => await csvDataWriter(dirPath, csvFileName, unscrapedData, [], true),
    // }

}