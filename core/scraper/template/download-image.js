const path = require("path");
const fileDownloader = require("../file-downloader");
const { toUrl } = require("../../../utilities");



toUrl

function getNameObjects(productObject, imageNameObject, imageDirPath, preferredExt,  i) {

    if(!productObject.imageUris.length)   {
        return [];
    }

    let { imageUris } = productObject,
        { shared, split } = imageNameObject,
        fileNameLength = 255 - (imageDirPath.length + preferredExt.length + 7),
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
        }(),
        nameObjects = [];
    
    for(let j = 0; j < imageUris.length; j++)   {

        let nm = splitNames.reduce((a, b) => {
                a += b.split("//").map(item => item.trim())[j];
                return a;
            }, ""),
            imageName = toUrl([`${i + 1} ${j + 1}`, nm, ...sharedNames].join(" ").slice(0, fileNameLength)),
            imageUri = imageUris[j],
            fileName = `${imageName}.${preferredExt}`,
            filePath = path.join(imageDirPath, fileName);

        nameObjects.push({imageName, imageUri, fileName, filePath});
    }

    return nameObjects;

}

module.exports = async function(productObject, imageDirPath, imagePropName, imageNameObject, callback, preferredExt = "jpg", i = 0)   {
    
    let nameObjects = getNameObjects(productObject, imageNameObject, imageDirPath, preferredExt, i);

    if(!nameObjects.length) {
        productObject[imagePropName] = ["NO IMAGE DOWNLOADED"];
        await callback({productObject, downloadResult : [{statusOk : false, fileName : productObject[imagePropName]}]});
        return;
    }

    let promises = nameObjects.map(item => {
            let {imageUri, imageName} = item;
            return fileDownloader.bind(null, imageUri, imageName, imageDirPath, preferredExt);
        });

    let downloadResults = await Promise.all(promises.map(item => item())),
        imageNames = await Promise.all(downloadResults.map(async item => {
            return item.fileName;
        }));
    console.log({imageNames});
   
    productObject[imagePropName] = imageNames.join(" // ");
    await callback({productObject, downloadResult : downloadResults});
    
}