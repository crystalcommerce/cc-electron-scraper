const { ipcRenderer } = require("electron");

// we listen for the event from the browserWindow object,
// we get the browserWindowId,
// then we execute whatever function we have to execute on the page,
// we send the data to ipcMain, ipcMain then navigates to the next page and gets the next set of data;

ipcRenderer.on("browserWindowId", (e, data) => {
    window.ccBrowserWindowId = data;
    
    // initialize the process here...

    sendDataToMain({
        message : "Hello there, Michael Norward!",
        application : "Electron Scraper",
        version : 1,
        author : "Michael Norward Miranda", 
    })
});

function sendDataToMain(data)   {
    ipcRenderer.send("browser-window-data", {
        browserWindowId : window.ccBrowserWindowId,
        ...data,
        url : window.location.href,
    })
}

// const { browserWindowId } = remote.getCurrentWebContents();

window.addEventListener("load", (e) => {
    

    document.body.style.zoom = 1; // .2 zoom means min width of 240 px

    console.log({
        Application : "ElectronJS Scraper Desktop Application",
        Browser : "Chromium Browser",
        message : "This window is controlled by Michael Norward...",
        author : "Michael Norward Miranda",
        url : window.location.href,
        ccBrowserWindowId : window.ccBrowserWindowId,
    });
    
});



