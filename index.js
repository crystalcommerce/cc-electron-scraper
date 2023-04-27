const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./core/browser/api/create-app-window");
const AppWindow = require("./core/browser/classes/app-window");

const viewsPath = path.join(__dirname, "views", "index.html");

app.whenReady().then(() => {

    createAppWindow(viewsPath);

    // new app window;
    ipcMain.on("new-app-instance", () => {
       
        const appWindowObject = createAppWindow(viewsPath);

        console.log({
            message : "We are creating a new app window...",
            windowId : appWindowObject.windowId
        })
    });

    // closing application window
    ipcMain.on("close-application", (e, data) => {
        e.preventDefault();

        let appWindowObject = AppWindow.windowObjects.find(item => data.windowId === item.windowId);
        appWindowObject.close();        
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
    });

    // create-frame-window - maybe this has to be automatically created o
    // update-frame-window
    ipcMain.on("update-main-frame-window", (e, data) => {
        console.log(data);
    });


    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});