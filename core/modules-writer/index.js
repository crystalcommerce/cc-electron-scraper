const moduleWriter = require("./api/module-writer");

module.exports = async function({fileName, fileType, textData, dirPath})   {

    return await moduleWriter({
        dirPath,
        fileName, 
        fileType : fileType.replace(/\./gi, ""),
        textData : textData.data,
    });

}