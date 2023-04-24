const AppWindow = require("../classes/app-window");

module.exports = function (resourceLocation) {
    
    let mainAppWindow;

    mainAppWindow = new AppWindow(resourceLocation);

    mainAppWindow.initialize();

    // mainAppWindow.windowObject.webContents.openDevTools();

    mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // we add the windowObject to the global and static properties of the class that created them
        mainAppWindow.addToWindowObjects();
        
        mainAppWindow.windowObject.webContents.send("app-window-id", mainAppWindow.windowId);       
        
        // invoke main browser frame container once;

        // this will have child browsers either a multi frame browser or a single frame browser...

    });

    return mainAppWindow;

}