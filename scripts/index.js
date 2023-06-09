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
    moderator,
    waitForCondition,
} = require("../utilities");

const { ipcRenderer } = require("electron");
const path = require("path");
const generateUuid = require("mnm-uuid");
// const evaluatorPath = path.join(app.getPath("appData"), "cc-electron-scraper", "modules", "scripts", "rebag-bags.js");

console.log(path);
// console.log(evaluatorPath);


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
    moderator,
    waitForCondition,
};
window.scriptAuthor = global.scriptAuthor;
console.log(window.ccPageUtilities);
console.log(window.scriptAuthor);

// window.ipcRenderer = ipcRenderer;

// console.log(ipcRenderer);


ipcRenderer.on("browser-window-details", (e, data) => {
    console.log(data);
});