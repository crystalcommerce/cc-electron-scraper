const fs = require("fs");
const path = require("path");

const mimeTypes = { 
    "aac" : "audio/aac",
    "abw" : "application/x-abiword",
    "arc" : "application/x-freearc",
    "avi" : "video/x-msvideo",
    "azw" : "application/vnd.amazon.ebook",
    "bin" : "application/octet-stream",
    "bmp" : "image/bmp",
    "bz" : "application/x-bzip",
    "bz2" : "application/x-bzip2",
    "cda" : "application/x-cdf",
    "csh" : "application/x-csh",
    "css" : "text/css",
    "csv" : "text/csv",
    "doc" : "application/msword",
    "docx" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "eot" : "application/vnd.ms-fontobject",
    "epub" : "application/epub+zip",
    "gz" : "application/gzip",
    "gif" : "image/gif",
    "html" : "text/html",
    "htm" : "text/html",
    "ico" : "image/vnd.microsoft.icon",
    "ics" : "text/calendar",
    "jar" : "application/java-archive",
    "jpg" : "image/jpeg",
    "jpeg" : "image/jpeg",
    "js" : "text/javascript",
    "json" : "application/json",
    "jsonld" : "application/ld+json",
    "mid" : "audio/midi",
    "mid" : "audio/x-midi",
    "midi" : "audio/midi",
    "midi" : "audio/x-midi",
    "mjs" : "text/javascript",
    "mp3" : "audio/mpeg",
    "mp4" : "video/mp4",
    "mpeg" : "video/mpeg",
    "mpkg" : "application/vnd.apple.installer+xml",
    "odp" : "application/vnd.oasis.opendocument.presentation",
    "ods" : "application/vnd.oasis.opendocument.spreadsheet",
    "odt" : "application/vnd.oasis.opendocument.text",
    "oga" : "audio/ogg",
    "ogv" : "video/ogg",
    "ogx" : "application/ogg",
    "opus" : "audio/opus",
    "otf" : "font/otf",
    "png" : "image/png",
    "pdf" : "application/pdf",
    "php" : "application/x-httpd-php",
    "ppt" : "application/vnd.ms-powerpoint",
    "pptx" : "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "rar" : "application/vnd.rar",
    "rtf" : "application/rtf",
    "sh" : "application/x-sh",
    "svg" : "image/svg+xml",
    "swf" : "application/x-shockwave-flash",
    "tar" : "application/x-tar",
    "tif" : "image/tiff",
    "tiff" : "image/tiff",
    "ts" : "video/mp2t",
    "ttf" : "font/ttf",
    "txt" : "text/plain",
    "vsd" : "application/vnd.visio",
    "wav" : "audio/wav",
    "weba" : "audio/webm",
    "webm" : "video/webm",
    "webp" : "image/webp",
    "woff" : "font/woff",
    "woff2" : "font/woff2",
    "xhtml" : "application/xhtml+xml",
    "xls" : "application/vnd.ms-excel",
    "xlsx" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "xml" : "application/xml",
    "xml" : "text/xml",
    "xul" : "application/vnd.mozilla.xul+xml",
    "zip" : "application/zip",
    "3gp" : "video/3gpp",
    "3gp" : "audio/3gpp",
    "3g2" : "video/3gpp2",
    "3g2" : "audio/3gpp2",
    "7z" : "application/x-7z-compressed"
};

function baseName(fileName, ...args)  {
    return path.basename(fileName, ...args);
}

function fileExists(filePath)    {
    return fs.existsSync(filePath);
}

function isFile(path)    {
    try{
        const stats = fs.statSync(path);
        return stats.isFile();
    } catch(err)    {
        return false;
    }
}

function isDirectory(path) {
    try{
        const stats = fs.statSync(path);
        return stats.isDirectory();
    } catch(err)    {
        return false;
    }
}

function getFileExt(filePath)    {
    return path.extname(filePath);
}

function getParentDir(filePath)    {
    return path.dirname(filePath);
}

async function readdir(dirPath, options = { encoding : "utf8" })   {
    let reason = null,
        data = await fs.promises.readdir(dirPath, options).catch(err => reason = err.message);
    return !reason && data ? {
        status : "success",
        result : true,
        message : `We have successfully retrieved the data from the directory : ${dirPath}`,
        data,
    } : {
        status : "failed",
        result : false,
        message : `We have encountered problems with retriving the files inside this directory : ${dirPath}`,
        reason,
    };
}

function readdirSync(dirPath,  options = { encoding : "utf8" }) {
    try {
        let data = fs.readdirSync(dirPath, options);
        return {
            status : "success",
            result : true,
            message : `We have successfully retrieved the data from the directory : ${dirPath}`,
            data,
        }
    } catch(err)    {
        return {
            status : "failed",
            result : false,
            message : `We have encountered problems with retriving the files inside this directory : ${dirPath}`,
            reason : err.message,
        }
    }
}

async function mkdir(dirPath, options = { recursive : true}) {
    try {
        let result = await fs.promises.mkdir(dirPath, options);
        if(!fileExists(dirPath)) throw Error(`We are unsuccessful in creating the folder directory for "${dirPath}".`)
        return {
            status : "success",
            result : true,
            message : `We have successfully created the folder directory for "${dirPath}"`,
        }
    } catch(err)    {
        return {
            status : "failed",
            result : false,
            message : err.message,
        }
    }
}

function mkdirSync(dirPath, options = {recursive : true})    {
    try {
        fs.mkdirSync(dirPath, options);
        return {
            status : "success",
            result : true,
            message : `We have successfully created the folder directory for "${dirPath}".`,
        };
    } catch(err) {
        return {
            status : "failed",
            result : false,
            message : `We are unsuccessful in creating the folder directory for "${dirPath}".`,
            reason : err.message,
        }
    }
}

async function deleteDir(dirPath, options = {recursive : false})  {
    let reason = null;
    await fs.promises.rm(dirPath, options).catch(err => reason = err.message);
    return !reason ? {
            status : "success",
            result : true,
            message : `The directory : "${dirPath}",  was successfully deleted.`,
        } : {
            status : "failed",
            result : false,
            message : `We were unsuccessful in deleteng this directory : "${dirPath}."`,
            reason,
        };
}

function deleteDirSync(dirPath, options = {recursive : false})    {
    try {
        fs.rmSync(dirPath, options);
        return {
            status : "success",
            result : true,
            message : `The directory : "${dirPath}",  was successfully deleted.`,
        };

    } catch(err)    {
        return {
            status : "failed",
            result : false,
            message : `We were unsuccessful in deleteng this directory : "${dirPath}."`,
            reason : err.message,
        }
    }
}

async function readFile(filePath,  options = {encoding : "utf8"})  {
    let reason = null,
        data = await fs.promises.readFile(filePath, options).catch(err => reason = err.message);
    return !reason ? { 
            result : true, 
            status : "success", 
            message : `We have retrieved the data from ${baseName(filePath)}.`,
            data, 
        } : {
            result : false, 
            status : "failed", 
            message : `We weren't able to retrieve the datafrom ${baseName(filePath)}.`, 
            reason,
        };
}

function readFileSync(filePath, options = {encoding : "utf8"})  {
    try{
        let data = fs.readFileSync(filePath, options);
        return {
             result : true, 
             status : "success",  
             message : `We have successfully retrieved the data from ${baseName(filePath)}.`,
             data,
        };
    } catch(err)    {
        return {
            result : true, 
            status : "success",  
            message : `We were not able to retrieve the data from ${baseName(filePath)}.`,
            reason : err.message,
       };
    }
}

async function writeFile(filePath, data, options = {encoding : "utf8"}) {
    let reason = null;
    await fs.promises.writeFile(filePath, data, options).catch(err => reason = err.message);
    return !reason ?   {
            result : true, 
            status : "success", 
            message : `We have successfully written the data to the file : ${baseName(filePath)}.`
        } : {
            result : false, 
            status : "failed", 
            message : `We were not successful in writing the data to the file : ${baseName(filePath)}.`, 
            reason
        };
}

function writeFileSync(filePath, data, options = {encoding : "utf8"}) {
    try{
        fs.writeFileSync(filePath, data, options);
        return {
            result : true, 
            status : "success", 
            message : `We have successfully written the data to the file : ${baseName(filePath)}.`,
        }
    } catch(err)    {
        return {
            result : false, 
            status : "failed", 
            message : `We were not successful in writing the data to the file : ${baseName(filePath)}.`, 
            reason : err.message,
        }
    }
}

async function deleteFile(filePath)    {
    try {
        let reason = null;
        await fs.promises.unlink(filePath).catch(err => reason = err.message);

        if(reason || fileExists(filePath))  {
            throw Error(`We weren't successful in deleting the file ${baseName(filePath)} : ${reason}`);
        }
        return {
            status : "successful",
            result : true,
            message :  `We have successfully deleted the file : "${baseName(filePath)}"`
        }
    } catch(err)    {
        return {
            status : "unchanged",
            result : false,
            message : err.message,
        };
    }
}

function deleteFileSync(filePath)    {
    try{
        fs.unlinkSync(filePath);
        return  {
            result : true, 
            status : "success", 
            message : `We have successfully deleted the file : "${filePath}"`
        }
    } catch(err)    {
        return {
            result : true, 
            status : "false", 
            message :  `We weren't successful in deleting the file : ${filePath}`,
            reason : err.message,
        }
    }
}

async function getFileSize(filePath)    {
    if(!fs.existsSync(filePath))    {
        return false;
    }
    let stats = fs.statSync(filePath);
    return stats.size;
}

/*******************************
********************************
* 
* 
* Advance File System methods;
* 
*
********************************
*******************************/

async function isFileEmpty(dirPath, options = {encoding : "utf8"})   {
    let { data } = await readFile(dirPath, options);
    return data && data.length === 0 ? true : data && data.length ? false : true;
}

function isFileEmptySync(dirPath, options = {encoding : "utf8"})   {
    let { data } = readFileSync(dirPath, options);
    return data && data.length === 0 ? true : data && data.length ? false : true;
}

async function isDirectoryEmpty(dirPath, options = {encoding : "utf8"})  {
    let { data } = await readdir(dirPath, options);
    return data && data.length === 0 ? true : data && data.length ? false : true;
}

function isDirectoryEmptySync(dirPath, options = {encoding : "utf8"})  {
    let { data } = readdirSync(dirPath, options);
    return data && data.length === 0 ? true : data && data.length ? false : true;
}

async function getAllFilesFromDirectory(dirPath, fileExt = null) {
    if(isDirectory(dirPath))   {
        let { data } = await readdir(dirPath);
        return data.filter(item => {
            let filePath = path.join(dirPath, item),
                result = !fileExt ? true : path.extname(item) === fileExt;
            return isFile(filePath) && result;
        });
    }
}

function getAllFilesFromDirectorySync(dirPath, fileExt = null) {
    if(isDirectory(dirPath))   {
        let { data } = readdirSync(dirPath);
        return data.filter(item => {
            let filePath = path.join(dirPath, item),
                result = !fileExt ? true : path.extname(item) === fileExt;
            return isFile(filePath) && result;
        });
    }
}

async function getAllDirsFromDirectory(dirPath)  {
    if(isDirectory(dirPath))   {
        let { data } = await readdir(dirPath);
        return data.filter(item => {
            let directoryPath = path.join(dirPath, item);
            return isDirectory(directoryPath);
        });
    }
}

function getAllDirsFromDirectorySync(dirPath)  {
    if(isDirectory(dirPath))   {
        let { data } = readdirSync(dirPath);
        return data.filter(item => {
            let directoryPath = path.join(dirPath, item);
            return isDirectory(directoryPath);
        });
    }
}

function getFileObject(filePath)   {
    let parentDir = getParentDir(filePath),
        file = path.basename(filePath);
    return isDirectory(filePath) ? {
        name : file,
        parentDir,
        fileType : "directory",
        path : filePath,
        includedFiles : [],
    } : {
        name : file.replace(path.extname(file), ""),
        parentDir,
        fileType : path.extname(file),
        path : filePath,
    }
}

async function getAllFilesRecursively(dirPath, excludedFolders = []) {
    let allFiles = [],
        {data} = await readdir(dirPath);
    
    for(let item of data)   {
        let filePath = path.join(dirPath, item)
        allFiles.push(getFileObject(filePath));
    }
    for(let file of allFiles)   {
        if(isDirectory(file.path) && !excludedFolders.includes(file.name)) {
            let files = await getAllFilesRecursively(file.path);
            file.includedFiles.push(...files);
        }
    }

    return allFiles;
}

function getAllFilesRecursivelySync(dirPath, excludedFolders = []) {
    let allFiles = [],
        {data} = readdirSync(dirPath);
    
    for(let item of data)   {
        let filePath = path.join(dirPath, item)
        allFiles.push(getFileObject(filePath));
    }
    for(let file of allFiles)   {
        if(isDirectory(file.path) && !excludedFolders.includes(file.name)) {
            let files = getAllFilesRecursivelySync(file.path);
            file.includedFiles.push(...files);
        }
    }

    return allFiles;
}

async function deleteAllFilesInDirPath(dirPath, recursive = false)    {
    let readDirResultObject = await readdir(dirPath),
        {data, result} = readDirResultObject,
        results = [],
        errorMessages = [];
    if(!result)    {
        return readDirResultObject;
    }
    if(data.length) {
        for(let item of data)   {
            let subPath = path.join(dirPath, item);
            if(isFile(subPath))   {
                let { result, reason } = await deleteFile(subPath);
                results.push(result);
                if(!result) {
                    errorMessages.push(`The file was not deleted : ${reason}.`);
                }
            } else if(isDirectory(subPath) && recursive)   {
                let resultObject = await deleteAllFilesInDirPath(subPath, recursive);
                if(resultObject.errorMessages)  {
                    errorMessages.push(...resultObject.errorMessages);
                }
            }
        }

        return results.every(res => res) ? {
            status : "success",
            message : recursive ? `We have successfully deleted all included files inside this directory : "${dirPath}", and also all files included in its subdirectories.` : `We have successfully removed all the included files inside this directory : "${dirPath}".`,
            result : true,
        } : {
            status : "failed",
            message : `We were not successful in removing all the files inside the directory :"${dirPath}"; Please refer to the recorded error messages we have included.`,
            result : false,
            errorMessages,
        };
    } else  {
        return  {
            status : "unchanged",
            result : true,
            message : `There are no files in this directory : ${dirPath}`,
        }
    }
}

async function deleteAllDirsInDirPath(dirPath, options = {recursive : false}) {
    let readDirResultObject = await readdir(dirPath),
        {data, result} = readDirResultObject,
        results = [],
        errorMessages = [];
    if(!result)    {
        return readDirResultObject;
    }
    if(data.length) {
        for(let item of data)   {
            let subPath = path.join(dirPath, item);
            if(isDirectory(subPath))   {
                let {result, reason} = await deleteDir(subPath, options);
                results.push(result);
                if(!result)  {
                    errorMessages.push(`The subdirectory path : ${subPath} was not deleted : ${reason}`);
                }
            }
        }

        return results.every(res => res) ? {
            status : "success",
            message : `We have successfully deleted all directories in this ${dirPath}`,
            result : true,
        } : {
            status : "failed",
            message : `We were not successful in removing all the directories inside the directory :"${dirPath}"; Please refer to the recorded error messages we have included.`,
            result : false,
            errorMessages,
        };
    } else  {
        return  {
            status : "unchanged",
            result : true,
            message : `There are no directories in this directory : ${dirPath}`,
        }
    }
}

async function deleteAllInDirPath(dirPath) {
    let resultsObject = await deleteAllFilesInDirPath(dirPath, true),
        resultsObject2 = await deleteAllDirsInDirPath(dirPath, {recursive : true}),
        finalResult = !resultsObject.result && !resultsObject2.result ? {
            result : false,
            status : "failed",
            errorMessages : resultsObject.errorMessages ? resultsObject.errorMessages : [],
        } : {
            result : true,
            status : "success",
            message : `We have successfully deleted everything inside this directory : ${dirPath}`,
        };
        !finalResult.result && resultsObject2.errorMessages ? finalResult.push(...resultsObject2.errorMessages) : null;
    
    return finalResult;
}

async function deleteAllEmptyFilesInDirectory(dirPath, recursive) {
    let resultObject = await readdir(dirPath),
        {data, result} = resultObject,
        results = [],
        errorMessages = []

    // if result is false; 
    // the error will be the fact that no file was found in the path provided.
    if(!result)    {
        return resultObject;
    }
    if(data.length) {
        for(let item of data)   {
            let filePath = path.join(dirPath, item),
                fileIsEmpty = await isFileEmpty(filePath);
            if(isFile(filePath) && fileIsEmpty)  {
                let {result, reason} = await deleteFile(filePath);
                results.push(result);
                if(!result) {
                    errorMessages.push(`The file was not deleted : ${reason}.`);
                }
            } else if(isDirectory(filePath) && recursive)   {
                let resultsObject = await deleteAllEmptyFilesInDirectory(filePath, recursive);
                if(!resultsObject.result) {
                    errorMessages.push(...resultsObject.errorMessages);
                }
            }
        }

        return results.every(res => res) ? {
            status : "success",
            result : true,
            message : `We have successfully deleted all empty files${recursive ? ", and all other empty files inside the subdirectories" : ""} from this directory path : "${dirPath}".`  
        } : {
            status : "failed",
            result : false,
            message : `We were not successful in removing all the empty files inside this directory : ${dirPath}. Please refer to the recorded error messages we have included.`,
            errorMessages,
        };

    } else  {
        return {
            status : "unchanged",
            result : true,
            message : `There are no files in this directory : ${dirPath}.`,
        }
    }
}

async function deleteAllEmptyDirsInDirectory(dirPath, recursive)    {
    let resultObject = await readdir(dirPath),
        {result, data} = resultObject,
        results = [],
        errorMessages = [];
    
    if(!result) {
        return resultObject;
    }
    if(data.length) {
        
        for(let item of data)   {
            let filePath = `${dirPath}/${item}`,
                isEmpty = await isDirectoryEmpty(filePath);
            if(isDirectory(filePath))   {
                if(isEmpty) {
                    let {result, reason} = await deleteDir(filePath, {recursive});
                    results.push(result);
                    if(!result) {
                        errorMessages.push(`${messge}. ${reason}.`);
                    }
                } else  {
                    if(recursive)   {
                        let resultsObject = await deleteAllEmptyDirsInDirectory(filePath, recursive);
                        if(!resultsObject.result)   {
                            errorMessages.push(...resultsObject.errorMessages);
                        }
                        if(await isDirectoryEmpty(filePath))   {
                            await deleteDir(filePath, {recursive});
                        }
                    }
                }
            }
        }


        return results.every(res => res) ? {
            status : "success",
            result : true,
            message : `We have successfully deleted all empty directories${recursive ? ", and all other empty directories inside the subdirectories" : ""} from this directory path : "${dirPath}".` 
        } : {
            status : "failed",
            result : false,
            message : `We were not successful in removing all the empty directories inside this directory path : ${dirPath}. Please refer to the recorded error messages we have included.`,
            errorMessages,
        };

    } else  {
        return  {
            status : "unchanged",
            result : true,
            message : `There are no files in this directory : ${dirPath}.`,
        }
    }
}

function getMimeType(file)  {
    if(isDirectory(file))   {
        return;
    }
    let {fileType} = getFileObject(file);
        
    fileType = fileType.replace(".", "");

    return mimeTypes[fileType];
    
}

function getFileExtensionsByMimeType(mimeType) {
    return Object.keys(mimeTypes).filter(key => mimeTypes[key] === mimeType).map(item => `${item}`);
}

function getSpecifiedExt(url, fileExtensions)  {
    if(fileExtensions.length > 1)   {
        let foundExtensions = fileExtensions.filter(ext => url.includes(`.${ext}`));
        return foundExtensions.length >= 1 ? foundExtensions[0] : fileExtensions[0];
    } else  {
        return fileExtensions[0];
    }
}


async function createDirPath(...args)   {
    let dirPath = path.join(...args);
    if(!fs.existsSync(dirPath)) {
        await fs.promises.mkdir(dirPath, {recursive : true});
    }
    return dirPath;
}

async function createSvgFile(filePath, svgName, svgData)   {
    let fileName = path.join(filePath, `${svgName}.svg`);
    await fs.promises.writeFile(fileName, svgData, {encoding : "utf8"});
    return { imageName : `${path.basename(fileName)}`, imagePath : filePath };
}


module.exports = {

    baseName,

    fileExists,

    isFile,

    isDirectory,

    getFileExt,

    getParentDir,

    readdir,

    readdirSync,

    mkdir,

    mkdirSync,

    deleteDir,

    deleteDirSync,

    readFile,

    readFileSync,

    writeFile,

    writeFileSync,

    
    deleteFile,

    deleteFileSync,

    isFileEmpty,

    isFileEmptySync,

    isDirectoryEmpty,

    isDirectoryEmptySync,

    getAllFilesFromDirectory,

    getAllFilesFromDirectorySync,

    getAllDirsFromDirectory,

    getAllDirsFromDirectorySync,

    getFileObject,

    getAllFilesRecursively,

    getAllFilesRecursivelySync,

    // currently, all delete methods are async as we don't need any data returned from them;

    deleteAllFilesInDirPath,

    deleteAllDirsInDirPath,

    deleteAllInDirPath,

    deleteAllEmptyFilesInDirectory,

    deleteAllEmptyDirsInDirectory,

    getMimeType,

    getFileExtensionsByMimeType,

    getSpecifiedExt,

    getFileSize,

    createSvgFile,

    createDirPath,

};