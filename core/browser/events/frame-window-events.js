const setFrameWindow = require("../api/set-frame-window");

module.exports = function(ipcMain, appObject)   {
    
    /* FRAME WINDOW EVENTS */
    // get the assigned frame window
    ipcMain.on("set-frame-dimensions", setFrameWindow);

}