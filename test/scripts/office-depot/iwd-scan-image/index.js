const { createDirPath, generateUuid, moderator, waitForCondition, readFile, objectToQueryString, apiRequest } = require('../../../../utilities');
module.exports = async function()   {
    let serverUrl = "http://localhost:7000",
        imageUrl = "https://static.grainger.com/rp/s/is/image/Grainger/56LL61_AW01"
        productApiUrl = "http://localhost:7000/api/grainger-packaging-and-shipping-supplies/64a835f2f36a8d4e3002eef4";
        foundData = await apiRequest(`${serverUrl}/api/scanned-images/single?imageUrl=${encodeURIComponent(imageUrl)}&productApiUrl=${encodeURIComponent(productApiUrl)}`);

    console.log(foundData);
}