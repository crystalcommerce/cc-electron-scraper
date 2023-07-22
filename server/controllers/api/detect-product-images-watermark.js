const { apiRequest, slowDown } = require("../../../utilities");
const scannedImagesDb = require("../../models/scanned-images-db");


async function detectWaterMark(imageUri, serverUrl) {
    try {
        let googleIwdApiUrl = `${serverUrl}/api/detect-watermark`,
            scanResult = await apiRequest(googleIwdApiUrl, {
                method : "POST",
                body : JSON.stringify({url : imageUri}),
                headers : {
                    "Content-Type" : "application/json",
                }
            }, true);
            
        return scanResult;
    } catch(err)    {
        console.log({
            statusOk : false,
            message : `Error in scanning the image : ${err.message}`,
        })
    }
    
}

async function createScannedImageOnDb({imageUrl, scanResult, productApiUrl, serverUrl}) {

    let createResult = await apiRequest(`${serverUrl}/api/scanned-images`, {
        method : "POST",
        body : JSON.stringify({
            imageUrl,
            scanResult,
            productApiUrl,
        }),
        headers : {
            "Content-Type" : "application/json",
        }
    }, true);

    return createResult;
}

async function updateScannedImageOnDb({foundData, imageUrl, scanResult, productApiUrl, serverUrl}) {
    if(!foundData)   {
        return null;
    }
    
    let updateResult = await apiRequest(`${serverUrl}/api/scanned-images/${encodeURIComponent(foundData._id)}`, {
        method : "PUT",
        body : JSON.stringify({
            imageUrl,
            scanResult,
            productApiUrl,
        }),
        headers : {
            "Content-Type" : "application/json",
        }
    }, true);

    return updateResult;

    
}

module.exports = async function({productObject, productsApiUrl, serverUrl}) {

    try{

        

        let scannedImageUris = [],
            productSpecificApiUrl = `${productsApiUrl}/${productObject._id}`,
            promises = productObject.imageUris.map(imageUri => {
                return async function() {

                    let scanResult = await detectWaterMark(imageUri, serverUrl);

                    console.log(scanResult);

                    await slowDown();

                    await slowDown();

                    let foundData = await apiRequest(`${serverUrl}/api/scanned-images/single?imageUrl=${encodeURIComponent(imageUri)}&productApiUrl=${encodeURIComponent(productSpecificApiUrl)}`),
                        dbQueryResult = null;

                    console.log({productsApiUrl, serverUrl});

                    if(foundData)   {

                        dbQueryResult = await updateScannedImageOnDb({
                            serverUrl,
                            foundData, 
                            imageUrl : imageUri,
                            scanResult,
                            productApiUrl : productSpecificApiUrl,
                        });

                    } else  {

                        dbQueryResult = await createScannedImageOnDb({
                            serverUrl,
                            imageUrl : imageUri,
                            scanResult,
                            productApiUrl : productSpecificApiUrl,
                        });

                    }

                       

                    console.log(JSON.stringify(dbQueryResult, null, 4));

                    scannedImageUris.push({
                        imageUri,
                        ...scanResult,
                    });

                    return {
                        imageUri,
                        dbQueryResult,
                        scanResult,
                    };

                }
            });

        let resultObjects = await Promise.all(promises.map(item => item()));

        productObject.scannedImageUris = scannedImageUris;

        return resultObjects;

    } catch(err)    {
        console.log({
            statusOk : false,
            message : `Error in saving the scanned image : ${err.message}`,
        });
    }

    

}