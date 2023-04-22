const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./core/browser/api/create-app-window");

const viewsPath = path.join(__dirname, "views", "index.html");

createAppWindow(app, ipcMain, viewsPath, (mainAppWindow) => {


    console.log("app has started...", {
        mainAppWindowId : mainAppWindow.windowId,
    });
});