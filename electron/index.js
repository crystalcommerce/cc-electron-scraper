const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./api/create-app-window");
const removeReload = require("../config/remove-reload");

/* Event Listeners */
const appWindowEvents = require("./events/app-window-events");
const frameWindowEvents = require("./events/frame-window-events");
const browserWindowEvents = require("./events/browser-window-events");

const viewsPath = path.join(process.cwd(), "views", "index.html");

const appObject = {
    ready : true,
}

function startElectronApp (serverProcess)    {

    removeReload();

    app.whenReady().then(() => {

        createAppWindow(viewsPath);

        appWindowEvents(ipcMain, appObject, viewsPath);

        frameWindowEvents(ipcMain, appObject);

        browserWindowEvents(ipcMain, appObject);
        
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
            serverProcess.kill();
        }
    });

}

module.exports = {startElectronApp, app};

