const { fileExists, isDirectory, toUrl, createDirPath, apiRequest, moderator, getInitials, generateUuid } = require("../../../utilities");
const path = require("path");
const bulkImageDownloader = require("./bulk-image-downloader");
const downloadImage = require("./download-image");
const getPaginatedCallbackObject = require("./get-paginated-callback-object");
const csvDataWriter = require("./csv-data-writer");


module.exports = async function({apiEndpoint, serverUrl, targetPath, setData, callback, currentPage, limit, dirPathIndex})   {
    currentPage = currentPage && typeof currentPage === "number" && currentPage > 0 ? currentPage : 1;
    limit = limit ? limit : 500;
    setData = setData && typeof setData === "object" ? setData : {};
    callback = callback ? callback : async () => {};
    dirPathIndex = dirPathIndex ? dirPathIndex : 1;

    let mainDirPath = await createDirPath(path.join(targetPath, toUrl(apiEndpoint))),
        {
            callback : pgCallback, 
            page, 
            pageTotal,
            data,
            apiUrl,
            totalCount,
        } = await getPaginatedCallbackObject({serverUrl, apiEndpoint, filter : setData, currentPage, limit});

    async function printDataToCsv(i = 1)    {

        let { data : productObjects } = await pgCallback(i),
            excludedKeys = [
                "imageUris",
                "imagePaths",
                "multiFaced",
                "_id",
                "dateCreated",
                "__v",
                "friendlyUrl",
                "categorizedSetId",
                "productUri",
                "scannedImageUris",
            ];
        
        await moderator(productObjects, async (slicedArr) => {

                // check the images products with watermarked images... 
                // modify the products based on their scan result;
                let dirPathNamesArr = Object.values(setData).map((value, index, arr) => {
                        let lastIndex = arr.length - 1;
                        if(index === lastIndex) {
                            return toUrl(`${dirPathIndex} ${value.trim()}`);
                        } else  {
                            return toUrl(value.trim());
                        }
                        
                    }),
                    csvFileNamesArr = Object.values(setData).map(value => toUrl(value.trim())),
                    firstIndex = ((i - 1) * limit) + 1,
                    lastIndex = slicedArr.length < limit ? firstIndex + slicedArr.length - 1 : firstIndex + limit - 1,
                    csvFileName = `${toUrl(csvFileNamesArr.join(" "))}-${firstIndex}-${lastIndex}-of-${totalCount}.csv`,
                    dirPath = await createDirPath(path.join(mainDirPath, ...dirPathNamesArr, `${firstIndex}-${lastIndex}-of-${totalCount}`));
                
                // download the images with the products;
                // print data to csv;

                await bulkImageDownloader({
                    dirPath, 
                    allProducts : slicedArr, 
                    downloadImageFn : downloadImage, 
                    imagePropName : "productImage", 
                    imageNameObject : {
                        shared : ["productName"],
                        split : []
                    }, 
                    callback,
                    preferedFileExt : "jpg", 
                });

                // print data to csv here...

            console.log({dirPath, csvFileName});

            await csvDataWriter(dirPath, csvFileName, slicedArr, excludedKeys, true);

        }, productObjects.length);

        if(i < pageTotal)   {
            i++;

            await printDataToCsv(i);
        }

    }

    await printDataToCsv(currentPage);
    

}