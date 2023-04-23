const AppWindow = require("../classes/app-window");

module.exports = function (resourceLocation) {
    

    let mainAppWindow;

    mainAppWindow = new AppWindow(resourceLocation);

    mainAppWindow.initialize();

    // mainAppWindow.windowObject.webContents.openDevTools();

    mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        mainAppWindow.addToWindowObjects();
        
        mainAppWindow.windowObject.webContents.send("app-window-id", mainAppWindow.windowId);        

    });

    return mainAppWindow;

}