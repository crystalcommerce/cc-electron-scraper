const detectProductImagesWatermark = require("../../../server/controllers/api/detect-product-images-watermark");
const { objectToQueryString, apiRequest, moderator } = require("../../../utilities");
const getPaginatedCallbackObject = require("./get-paginated-callback-object");

async function checkImageWatermark(productObject, productsApiUrl, serverUrl)    {
    return await detectProductImagesWatermark({
        productObject,
        productsApiUrl,
        serverUrl
    });
}

async function updateProduct(productObject, apiUrl)   {

    let apiUpdateUrl = `${apiUrl}/${productObject._id.toString()}`,
        updateResult = await apiRequest(apiUpdateUrl, {
            method : "PUT",
            body : JSON.stringify(productObject),
            headers : {
                "Content-Type" : "application/json",
            }
        }, true);

    return updateResult;

}

module.exports = async function({app, ipcMain, serverUrl, apiEndpoint, filter, currentPage, limit})  {

    currentPage = currentPage && typeof currentPage === "number" && currentPage > 0 ? currentPage : 1;
    limit = limit ? limit : 5;
    filter = filter && typeof filter === "object" ? filter : {};

    let {
            callback, 
            page, 
            pageTotal,
            data,
            apiUrl,
        } = await getPaginatedCallbackObject({serverUrl, apiEndpoint, filter, currentPage, limit}),
        iwdCheckResults = [];

    async function iwdCheckProductsImages(i = 1)    {

        let { data : productObjects } = await callback(i);
        
        await moderator(productObjects, async (slicedArr) => {

            let promises = slicedArr.map(productObject => {
                return async function() {


                    let iwdCheckResult = await checkImageWatermark(productObject, apiUrl, serverUrl);

                    console.log(iwdCheckResult);

                    iwdCheckResults.push(iwdCheckResult);


                    // console.log({productObject, apiUrl});

                    let updateResult = await updateProduct(productObject, apiUrl);

                    console.log(updateResult);
                }
            });

            await Promise.all(promises.map(item => item()));


        }, productObjects.length);

        if(i < pageTotal)   {
            i++;

            await iwdCheckProductsImages(i);
        }

    }

    await iwdCheckProductsImages(currentPage);
    
}