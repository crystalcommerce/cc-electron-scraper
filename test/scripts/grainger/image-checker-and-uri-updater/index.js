const detectProductImagesWatermark = require('../../../../server/controllers/api/detect-product-images-watermark');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');

async function getPaginatedResultsFn(apiUrl, filter, page = 1, limit = 5)  {

    let queryString = objectToQueryString(filter),
        url = `${apiUrl}/paginated?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&${queryString}`,
        getResult = await apiRequest(url, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
            },
        }, true),
        { pageTotal : initialPageTotal, totalCount, data } = getResult;
    
    return {
        callback : async function(newPage) {

            if(newPage > initialPageTotal)    {
                return;
            }
            
            let selectedPage = newPage ? newPage : page;

            url = `${apiUrl}/paginated?page=${encodeURIComponent(selectedPage)}&limit=${encodeURIComponent(limit)}&${queryString}`;

            let getResult = await apiRequest(url, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                },
            }, true),
            { pageTotal, totalCount } = getResult;

            console.log({pageTotal, totalCount, page : selectedPage});

            page = selectedPage;
            page = parseInt(page) + 1;

            return getResult;
        },
        pageTotal : initialPageTotal,
        totalCount,
        page : parseInt(page),
        data

    };
    
}

async function getPreReq()  {
    let serverUrl = "http://localhost:7000",
        apiUrl = `${serverUrl}/api/grainger-packaging-and-shipping-supplies`,
        { callback, page, pageTotal, data } = await getPaginatedResultsFn(apiUrl, {});

    return {
        callback, 
        page, 
        pageTotal,
        data,
        apiUrl,
        serverUrl,
    }
}

async function checkImageWatermark(productObject, productsApiUrl, serverUrl)    {
    return await detectProductImagesWatermark({
        productObject,
        productsApiUrl,
        serverUrl
    });
}

async function updateProductUri(productObject, apiUrl)   {

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

function getProductUriPath(productObject)   {
    let productIndex = productObject.productUri.indexOf("/product"),
        productPath = productObject.productUri.slice(productIndex);

    return productPath;
}

function getImageUrl(imageUri)    {
    let productIndex = imageUri.indexOf("//static"),
        imageUrl = imageUri.slice(productIndex);

    return `https:${imageUrl}`;
}

module.exports = async function()   {
    let i = 1,
        {
            callback, 
            page, 
            pageTotal,
            data,
            apiUrl,
            serverUrl,
        } = await getPreReq(),
        iwdCheckResults = [];

    async function iwdCheckProductsImages(i = 1)    {

        let { data : productObjects } = await callback(i);

        
        
        await moderator(productObjects, async (slicedArr) => {

            let promises = slicedArr.map(productObject => {
                return async function() {

                    // productObject.imageUris = productObject.imageUris.map(item => getImageUrl(item));

                    let iwdCheckResult = await checkImageWatermark(productObject, apiUrl, serverUrl);

                    console.log(iwdCheckResult);

                    iwdCheckResults.push(iwdCheckResult);


                    // productObject.productUri = `https://www.grainger.com${getProductUriPath(productObject)}`;

                    // console.log({productObject, apiUrl});

                    let updateResult = await updateProductUri(productObject, apiUrl);

                    console.log(JSON.stringify(updateResult, null, 4));
                }
            });

            await Promise.all(promises.map(item => item()));


        }, productObjects.length);

        if(i < pageTotal)   {
            i++;

            iwdCheckProductsImages(i);
        }

    }

    await iwdCheckProductsImages(i)
    
}