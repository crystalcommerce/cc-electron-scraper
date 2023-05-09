const fs = require("fs");
const path = require("path");
const { toUrl } = require("../../../utilities");


module.exports = async function({dirPath, fileName, fileType, textData}){

    try {
        let file = `${fileName}.${fileType}`,
            fileWritingError = null,
            fileCreated = false,
            fileSize = null,
            filePath = path.join(dirPath, `${toUrl(fileName)}.${fileType}`);


        // we write a new file here...

        const writeStream = fs.createWriteStream(filePath);


        writeStream.on("finish", () => {

            fs.stat(filePath, (err, stats) => {

                if (err) {
                    fileWritingError = err.message;
                    return;
                }
        
                fileCreated = true;
                fileSize = `${stats.size} bytes`;
            });
        });

        // writing of data
        writeStream.write(textData);

        // event trigger;
        writeStream.end();

        // checking of result;
        await new Promise((resolve) => {

            let time = 0,
                increments = 10 / 1000,
                interval = setInterval(() => {
                    
                    time += increments;


                    // console.log({fileCreated, fileWritingError, time : time.toFixed(2)});

                    if((fs.existsSync(filePath) && (fileCreated || fileWritingError))) {

                        clearInterval(interval);

                        resolve();

                    }

                    if(time > 300)   {

                        
                        fileWritingError = "Function execution for creating the file has exceeded the time limit.";

                        clearInterval(interval);
                        
                        resolve();

                    }

                }, 10);

        });

        
        if(fileWritingError)    {
            throw Error(fileWritingError);
        }

        return {
            resultData : {
                file,
                fileName,
                fileType,
                filePath,
                fileSize,
            },
            statusOk : true,
            message : `${fileName}.${fileType} was successfully created.`
        }

    } catch(err)    {
        console.log(err);
        return {
            resultData : null,
            message : `We weren't able to create the file : ${err.message}`,
            statusOk : false,
        }

    }
    
}