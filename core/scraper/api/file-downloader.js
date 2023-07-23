const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { toUrl, getFileSize, getFileExtensionsByMimeType, getSpecifiedExt, createDirPath, fileExists } = require("../../../utilities");

async function fileDownloader(url, givenFileName, downloadPath, preferedFileExt)    {

    let fileName = "NO IMAGE DOWNLOADED";

    try{
        let response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });

        if(response.status < 200 && response.status > 299)  {
            throw Error("We could not reach this url");
        }


        let mimeType = response.headers["content-type"],
            contentLength = Number(response.headers["content-length"]),
            fileExtensions = getFileExtensionsByMimeType(mimeType),
            webDeclaredExt = getSpecifiedExt(url, fileExtensions),
            fileExt = preferedFileExt ? preferedFileExt : webDeclaredExt;

        fileName = `${toUrl(givenFileName)}.${fileExt}`;
        
        
        // create folder path if it doesn't exist
        if(!fs.existsSync(downloadPath))  {
            await createDirPath(downloadPath);
        }

        const fileStream = fs.createWriteStream(path.join(downloadPath, fileName));
        response.data.pipe(fileStream);
        
        await new Promise(async (resolve, reject) => {

            let iteration = 0,
                interval = setInterval(() => {
                console.log({
                    fileName,
                    fileStreamEnded : fileStream.writableFinished,
                    message : `download retries : ${iteration} times`,
                });
                if(fileStream.writableFinished) {
                    console.log({
                        fileName, 
                        downloadPath,
                        url,
                        fileStreamEnded : fileStream.writableFinished,
                        message : `from interval ${interval}`
                    });
                    clearInterval(interval);
                    resolve();
                }
                iteration++;
            }, 500);
        });

    
        if(!fileExists(path.join(downloadPath, fileName)))  {
            throw Error("Download did not complete")
        }
        let fileSize = await getFileSize(path.join(downloadPath, fileName));
        fileSize = Number(fileSize);
        return {url, fileName, fileSize : `${(fileSize / (1024*1024)).toFixed(2)}Mb`, contentLength, fileSizeInBytes : fileSize, downloadPath, message : "We have successfully downloaded the file.", statusOk : true};

    } catch(err)    {
        return {url, fileName, message : err.message, statusOk : false};
    }

}

module.exports = fileDownloader;