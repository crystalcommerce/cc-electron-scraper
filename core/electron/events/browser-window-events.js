const browserLoadUrl = require("../api/browser-load-url");
const closeBrowserWindow = require("../api/close-browser-window");
const createBrowserWindow = require("../api/create-browser-window");
const openBrowserDevTools = require("../api/open-browser-dev-tools");
const setActiveBrowser = require("../api/set-active-browser");


module.exports = function(ipcMain, appObject)  {
    /* BROWSER WINDOW EVENTS */
    // create browser;
    ipcMain.on("create-browser-window", (e, data) => {
        
        let browserWindow = createBrowserWindow(data.payload, appObject, () => {
            e.sender.send("browser-window-created", {
                message : "Browser Window has been created",
                payload : {
                    AppWindowId : browserWindow.parentWindowId,
                    browserWindowId : browserWindow.windowId,
                    componentId : browserWindow.componentId,
                    dimensions : browserWindow.windowOptions,
                },
            });

        });

    });

    // close browser;
    ipcMain.on("close-browser-window", (e, data) => {

        closeBrowserWindow(data.payload, () => {
            e.sender.send("browser-window-closed", {
                message : "Browser Window has been closed",
                payload : data.payload,
            });
        });
        
    });

    // set active;
    ipcMain.on("set-active-browser-window", (e, data) => {
        setActiveBrowser(data.payload, () => {
            e.sender.send("browser-window-set-active", {
                message : "Browser Window has been set to active",
                payload : data.payload,
            });
        });
    });

    // hide frame window event;
    ipcMain.on("load-url", (e, data) => {
        browserLoadUrl(data.payload, () => {
            e.sender.send("url-loaded", {
                message : "url has been loaded...",
                payload : data.payload,
            });
        });            
    });

    // hiding browser windows during page navigation.
    ipcMain.on("hide-browser-windows", (e, data) => {


        e.sender.send("active-browsers-hidden", {
            message : "",
            statusOk : true,
            payload : {
                ...data,
            }
        })

    });

    // opening and closing of browserWindows devTools
    ipcMain.on("browser-dev-tools", openBrowserDevTools);

    
}