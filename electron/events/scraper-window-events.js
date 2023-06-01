const closeScraperWindow = require("../api/scraper-window/close-scraper-window")
const createScraperWindow = require("../api/scraper-window/create-scraper-window")
const hideAllScraperWindows = require("../api/scraper-window/hide-all-scraper-windows")
const setActiveScraperWindow = require("../api/scraper-window/set-active-scraper-window")
const toggleScraperWindowDevtools = require("../api/scraper-window/toggle-scraper-window-devtools")

module.exports = function(ipcMain, appObject)   {

    // create scraper window
    // close scraper window;

    /* 
        this will probably have to be inside the child process module... 'cause the process listed here is the actual child process and not the parent process 
    */
    process.on("message", (e, data) => {
        if(data.action === "create-scraper-window") {
            createScraperWindow(data.payload, appObject, (resultObject) => {
                e.sender.send("close-scraper-window", resultObject); // this will also have to be changed...
            });
        } else if(data.action === "create-scraper-window")  {
            closeScraperWindow(data.payload, appObject, (resultObject) => {
                e.sender.send("scraper-window-closed", resultObject); // this will also have to be changed...
            });
        }
        
    });

    // initializing categorized-sets-scraper
    ipcMain.on("initialize-categorized-sets-scraping", (e, data) => {

        

    });

    // initializing products-set-scraper
    ipcMain.on("initialize-categorized-sets-scraping", (e, data) => {

        

    });


    // initializing single-product-scraper
    ipcMain.on("initialize-categorized-sets-scraping", (e, data) => {

        

    });

    // set active scraper window - toggle between shown or hidden;
    ipcMain.on("set-active-scraper-window", (e, data) => {
        setActiveScraperWindow(data.payload, appObject, (resultObject) => {
            e.sender.send("scraper-window-set-active", resultObject);
        });
    });

    // hiding scraper windows on page navigation;
    ipcMain.on("hide-all-scraper-windows", (e, data) => {
        hideAllScraperWindows(data.payload, appObject, (resultObject) => {
            e.sender.send("all-scraper-windows-hidden", resultObject);
        });
    });

    // opening and closing scraper window devtools;
    ipcMain.on("toggle-scraper-window-dev-tools", (e, data) => {
        toggleScraperWindowDevtools(data.payload, appObject, (resultObject) => {
            e.sender.send("scraper-window-dev-tools-toggled", resultObject);
        });
    });

}