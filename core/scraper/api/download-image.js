const path = require("path");
const fileDownloader = require("./file-downloader");
const { toUrl, getInitials } = require("../../../utilities");

function getScannedImageObject(productObject, imageUri)    {
    let foundScannedImage = null;
    if(Array.isArray(productObject.scannedImageUris) && productObject.scannedImageUris.length)  {
        foundScannedImage = productObject.scannedImageUris.find(item => item.imageUri === imageUri);
    }

    return foundScannedImage;
}

function getScannedImageResult(scannedImageObj)   {

    if(!scannedImageObj)    {
        return "";
    }

    let output = "",
        i = 0;
    for(let key in scannedImageObj) {
        output += i > 0 ? `\n` : "";
        output += `${key} : ${scannedImageObj[key]}`;
        i++;
    }

    return output;
}

function setAddedName(scannedImageObj)  {
    let addedNames = [];

    if(!scannedImageObj)    {
        return [];
    }

    if(scannedImageObj.success) {
        addedNames.push("img-scan-success");
        if(scannedImageObj.hasWatermark)    {
            addedNames.push("img-has-watermark");
        } else  {
            addedNames.push("img-no-watermark");
        }

    } else  {
        addedNames.push("img-scan-failed");
        addedNames.push("img-may-have-watermark");
    }

    return addedNames;
}

function getNameObjects(productObject, imageNameObject, imageDirPath, preferredExt,  i) {

    if(!productObject.imageUris.length)   {
        return [];
    }

    productObject.scannedImagesResults = "";

    let { imageUris } = productObject,
        { shared, split } = imageNameObject,
        fileNameLength = 500 - (imageDirPath.length + preferredExt.length + 7),
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
            return names.map(item => getInitials(item));
        }(),
        nameObjects = [];
    
    for(let j = 0; j < imageUris.length; j++)   {

        let nm = splitNames.reduce((a, b) => {
                a += b.split("//").map(item => getInitials(item.trim()))[j];
                return a;
            }, ""),
            imageUri = imageUris[j],
            scannedImageObj = getScannedImageObject(productObject, imageUri),
            addedNames = setAddedName(scannedImageObj),
            imageName = toUrl([`${i + 1} ${j + 1}`, nm, sharedNames.join(" "), ...addedNames].join(" ").slice(0, fileNameLength)),
            fileName = `${imageName}.${preferredExt}`,
            scannedImageresult = getScannedImageResult(scannedImageObj),
            filePath = path.join(imageDirPath, fileName);
        productObject.scannedImagesResults += j > 0 ? `\n\n` : "";
        productObject.scannedImagesResults += `${scannedImageresult}`;
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

            console.log(imageName);

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