const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const CcScraperWindow = require('./electron/classes/cc-scraper-window');

const { VM } = require("vm2");


function preloadScript() {
    // Your custom script logic here
    console.log('Preload script executed!');
}
// console.log(app)
app.whenReady().then(async () => {

    


    let ccScraperWindow = new CcScraperWindow({
        AppWindowId : null,
        componentId : null,
        preloadedScript : path.join(__dirname, "scripts"),
        scraperType : "single",
        resourceLocation : null,
    })

    console.log(ccScraperWindow);

    ccScraperWindow.initialize();

    ccScraperWindow.showWindow();

    console.log("waiting for 3 seconds...");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("3 seconds passed...");


    ccScraperWindow.load("https://youtube.com");


    console.log("waiting for 5 seconds...");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("5 seconds passed... we're opening the devtools...");

    ccScraperWindow.openDevTools();

    console.log("waiting for 5 seconds...");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("5 seconds passed... we're closing the devtools...");


    ccScraperWindow.windowObject.webContents.send("browser-window-details", {
        AppWindowId : ccScraperWindow.AppWindowId,
        browserWindowId : ccScraperWindow.windowId,
        componentId : ccScraperWindow.componentId,
        scraperType : ccScraperWindow.scraperType,
    })



    


});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});



