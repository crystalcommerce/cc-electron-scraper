const { registerWindowEvent } = require("../../../utilities");
const AppWindow = require("../classes/app-window");
const childProcess = require('child_process');
const createFrameWindow = require("./create-frame-window");


module.exports = function(app, ipcMain, resourceLocation, callback = () => {}) {

    let mainAppWindow;

    app.whenReady().then(() => {

        mainAppWindow = new AppWindow(resourceLocation);

        mainAppWindow.initialize();

        registerWindowEvent(mainAppWindow.windowId, mainAppWindow.windowObject.webContents, "did-finish-load", (e) => {
            // register this window to the static window objects array property of this class;
            mainAppWindow.addToWindowObjects();

            registerWindowEvent(mainAppWindow.windowId, ipcMain, "close-application", (e, data) => {
                console.log(data);
                mainAppWindow.windowObject.close();
            });

            registerWindowEvent(mainAppWindow.windowId, ipcMain, "minimize-application", (e, data) => {
                console.log(data);
                mainAppWindow.windowObject.minimize();
            });

            registerWindowEvent(mainAppWindow.windowId, ipcMain, "full-screen-application", (e, data) => {
                mainAppWindow.windowObject.setSimpleFullScreen(data.state);
            });

            registerWindowEvent(mainAppWindow.windowId, ipcMain, "update-frame-window", (e, data) => {
                console.log(data);
                
                // createFrameWindow(mainAppWindow.windowObject, "https://youtube.com", data);
            });

            registerWindowEvent(mainAppWindow.windowId, ipcMain, "new-app-instance", (e, data) => {
                console.log(data);
    
                childProcess.spawn(process.execPath, [app.getAppPath()], {
                    stdio: [ 'inherit', 'inherit', 'pipe', 'pipe', 'ipc' ]
                  });
            });
        });

        mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        })

        callback(mainAppWindow);

    });


    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit()
        }
    });


}