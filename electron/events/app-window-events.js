const createAppWindow = require("../api/create-app-window");
const takeScreenshot = require("../api/take-screenshot");
const AppWindow = require("../classes/app-window");
const CcBrowserWindow = require("../classes/cc-browser-window");


module.exports = function(ipcMain, appObject, viewsPath, userDataPath, serverUrl)  {
    /* APP WINDOW EVENTS */

    // new app;
    ipcMain.on("new-app-instance", () => {

        // childProcess.spawn(process.execPath, [app.getAppPath()], {stdio: 'inherit'});
    
        const appWindowObject = createAppWindow(viewsPath, userDataPath, serverUrl);

        console.log({
            message : "We are creating a new app window...",
            windowId : appWindowObject.windowId
        })
    });

    // closing application window
    ipcMain.on("close-application", (e, data) => {
        e.preventDefault();
        
        CcBrowserWindow.removeAllWindowObjects(data.windowId, null, () => {
            AppWindow.closeActiveWindows(data.windowId);
        });
        
    });

    // minimizing application-window
    ipcMain.on("minimize-application", (e, data) => {
        e.preventDefault();
        
        let appWindowObject = AppWindow.windowObjects.find(item => data.windowId === item.windowId);
        appWindowObject.windowObject.minimize();
    }); 

    // toggling full and non-full screen of application window
    ipcMain.on("full-screen-application", (e, data) => {
        let appWindowObject = AppWindow.windowObjects.find(item => data.windowId === item.windowId);

        appWindowObject.windowObject.setSimpleFullScreen(data.state);
        e.sender.send("set-full-screen-state", {
            AppWindow : {
                isOnFullScreen : appWindowObject.windowObject.isFullScreen(),
            }   
        });
        
    });
    
    // reloading the application
    ipcMain.on("reload-app-window", (e, data) => {

        appObject.ready = false;

        CcBrowserWindow.removeAllWindowObjects(data, null, () => {
            // AppWindow.closeActiveWindows(data.windowId);
            setTimeout(() => {
                appObject.ready = true;
                e.sender.send("app-is-ready", {
                    message : "App was reloaded and is now ready...",
                });
            }, 500);
        });

    });

    // take screen shots;
    ipcMain.on("take-screen-shot", (e, data) => {

        takeScreenshot(data.payload.AppWindowId);

        

    });

    ipcMain.on("scree-shot-taken", (e, data) => {
        e.sender.send("close-browser-window", data.payload.AppWindowId);
    })

    // test

    ipcMain.on("browser-window-data", (e, data) => {
        console.log(data);
    });

    

}