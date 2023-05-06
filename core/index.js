const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./browser/api/create-app-window");
const removeReload = require("../config/remove-reload");

/* Event Listeners */
const appWindowEvents = require("./browser/events/app-window-events");
const frameWindowEvents = require("./browser/events/frame-window-events");
const browserWindowEvents = require("./browser/events/browser-window-events");

const viewsPath = path.join(process.cwd(), "views", "index.html");

const appObject = {
    ready : true,
}

module.exports = function ()    {

    removeReload();

    app.whenReady().then(() => {

        createAppWindow(viewsPath);

        appWindowEvents(ipcMain, appObject, viewsPath);

        frameWindowEvents(ipcMain, appObject);

        browserWindowEvents(ipcMain, appObject);
        
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
        app.quit()
        }
    });
}

