const { fork } = require('child_process');
const path = require("path");
const { writeFile, createDirPath } = require('./file-system');

function registerWindowEvent(windowId, object, eventName, callback)  {

    if(!Array.isArray(global.eventListenersObject))  {
        global.eventListenersObject = [];
    }

    let foundRegisteredListener = global.eventListenersObject.find(item => item.windowId === windowId && item.eventName === eventName && item.object === object);

    if(!foundRegisteredListener) {
        object.on(eventName, callback);
        global.eventListenersObject.push({
            windowId,
            eventName,
            object,
            callback,
        });
    } 
    
}

function spawnOnChildProcess(filePath) {
    const childProcess = fork(filePath);
  
    childProcess.on('message', (data) => {
        console.log({
            message : "received message",
            data,
        });
    });
  
    childProcess.on('error', (error) => {
        console.error({
            message : `error occured`,
            error,
        });
    });
  
    childProcess.on('close', (code) => {
        console.log({
            message : `child process exited with code : ${code}`
        });
    });

    return childProcess;
}

async function createNodeModule(targetPath, fileName, textData) {
    let dirPath = await createDirPath(targetPath),
        filePath = path.join(dirPath, fileName),
        writeResult = await writeFile(filePath, textData);

    return writeResult;
}

function getRequestResult(result, status = 200, contentType = "application/json") {
    let obj = {
        contentType,
        status : status,
        data : contentType === "application/json" ? JSON.stringify(result, null, 4) : result,
    };
    return obj;
}

function sendDataToMainProcess(channel, data)   {
    // process.send({channel, data});

    // process.addListener("")

    console.log({
        channel,
        data
    });
}

module.exports = {
    registerWindowEvent,
    spawnOnChildProcess,
    getRequestResult,
    createNodeModule,
    sendDataToMainProcess
}