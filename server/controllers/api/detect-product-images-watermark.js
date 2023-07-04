const { apiRequest } = require("../../../utilities");
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

module.exports = async function({productObject, productsApiUrl, serverUrl}) {

    try{

        let scannedImageUris = [],
            productSpecificApiUrl = `${productsApiUrl}/${productObject._id}`,
            promises = productObject.imageUris.map(imageUri => {
                return async function() {

                    let scanResult = await detectWaterMark(imageUri, serverUrl),
                        createResult = await apiRequest(`${serverUrl}/api/scanned-images`, {
                            method : "POST",
                            body : JSON.stringify({
                                imageUrl : imageUri,
                                scanResult,
                                productApiUrl : productSpecificApiUrl,
                            }),
                            headers : {
                                "Content-Type" : "application/json",
                            }
                        }, true);

                    console.log(createResult);

                    scannedImageUris.push({
                        imageUri,
                        ...scanResult,
                    });

                    return {
                        imageUri,
                        createResult,
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
        })
    }

    

}