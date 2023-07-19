const detectProductImagesWatermark = require('../../../../server/controllers/api/detect-product-images-watermark');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
const getPaginatedResultsFn = require("../../../../server/controllers/api/get-paginated-results-fn");

async function getPreReq(app)  {
    // let payload = {
    //     ccScriptData : {
    //         fileName : "office-depot",
    //         apiEndpoint : "office-depots",
    //     },
    //     ccScraperData : {
    //         AppWindowId : null,
    //         componentId : null,
    //         scraperType : "single",
    //     },
    // },
    // appAbsPath = app.getAppPath(),
    // userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
    // serverUrl = "http://localhost:7000",
    // apiUrl = `${serverUrl}/api/${payload.ccScriptData.apiEndpoint}`,
    // { callback, page, pageTotal, data } = await getPaginatedResultsFn(apiUrl, {});

    // return {
    //     callback, 
    //     page, 
    //     pageTotal,
    //     data,
    //     payload, 
    //     appAbsPath, 
    //     userDataPath,
    //     serverUrl,
    // }
}

async function checkImageWatermark(productObject, productsApiUrl, serverUrl)    {
    // return await detectProductImagesWatermark({
    //     productObject,
    //     productsApiUrl,
    //     serverUrl
    // });
}

module.exports = async function(app)   {
    // let i = 1,
    //     {
    //         callback, 
    //         page, 
    //         pageTotal,
    //         data,
    //         apiUrl,
    //         serverUrl,
    //     } = await getPreReq(app),
    //     iwdCheckResults = [];

    // async function iwdCheckProductsImages(i = 1)    {

    //     let { data : productObjects } = await callback(i);

        
        
    //     await moderator(productObjects, async (slicedArr) => {

    //         let promises = slicedArr.map(productObject => {
    //             return async function() {

    //                 productObject.imageUris = productObject.imageUris.map(item => getImageUrl(item));

    //                 let iwdCheckResult = await checkImageWatermark(productObject, apiUrl, serverUrl);

    //                 console.log(iwdCheckResult);

    //                 iwdCheckResults.push(iwdCheckResult);


    //                 productObject.productUri = `https://www.grainger.com${getProductUriPath(productObject)}`;

    //                 // console.log({productObject, apiUrl});

    //                 let updateResult = await updateProductUri(productObject, apiUrl);

    //                 console.log(updateResult);
    //             }
    //         });

    //         await Promise.all(promises.map(item => item()));


    //     }, productObjects.length);

    //     if(i < pageTotal)   {
    //         i++;

    //         iwdCheckProductsImages(i);
    //     }

    // }

    // await iwdCheckProductsImages(i)
    
}