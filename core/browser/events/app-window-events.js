const { registerWindowEvent } = require("../../../utilities");
const childProcess = require('child_process');

const AppWindow = require('../classes/app-window');
// const FrameWindow = require('../classes/frame-window');
// const ScraperWindow = require('../classes/app-window');

module.exports = function(app, mainAppWindow, ipcMain)   {

    registerWindowEvent(mainAppWindow.windowId, ipcMain, "close-application", (e, data) => {
        e.preventDefault();
        console.log(data);
        console.log(AppWindow.windowObjects.length);

        console.log(mainAppWindow.windowId);
        // mainAppWindow.close();
    });

    registerWindowEvent(mainAppWindow.windowId, ipcMain, "minimize-application", (e, data) => {
        console.log(data);
        e.preventDefault();
        mainAppWindow.windowObject.minimize();
    });

    registerWindowEvent(mainAppWindow.windowId, ipcMain, "full-screen-application", (e, data) => {
        mainAppWindow.windowObject.setSimpleFullScreen(data.state);
    });

    registerWindowEvent(mainAppWindow.windowId, ipcMain, "update-frame-window", (e, data) => {
        console.log(data);
        
        // createFrameWindow(mainAppWindow.windowObject, "https://youtube.com", data);
    });
}