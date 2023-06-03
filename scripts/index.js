const { 
    slowDown, 
    toCamelCase, 
    toCapitalize, 
    toCapitalizeAll, 
    toUrl,
    scrollToBottom,
    scrollToTop,
    waitForSelector,
    typeIt,
    createJSONBlob,
    downloadJsonFile,
    downloadAllJsonFiles,
    downloadCsvData,
    readBlobData,
    zipData,
    timedReload, 
} = require("../utilities");
const {ipcRenderer} = require("electron");

window.ccPageUtilities = { 
    slowDown, 
    toCamelCase, 
    toCapitalize, 
    toCapitalizeAll, 
    toUrl,
    scrollToBottom,
    scrollToTop,
    waitForSelector,
    typeIt,
    createJSONBlob,
    downloadJsonFile,
    downloadAllJsonFiles,
    downloadCsvData,
    readBlobData,
    zipData,
    timedReload, 
};

window.ipcRenderer = ipcRenderer;

ipcRenderer.on("browser-window-details", (e, data) => {
    console.log(data);
});