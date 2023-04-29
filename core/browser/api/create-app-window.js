const AppWindow = require("../classes/app-window");
const createFrameWindow = require("./create-frame-window");

module.exports = function (resourceLocation) {
    
    let mainAppWindow;

    mainAppWindow = new AppWindow(resourceLocation);

    mainAppWindow.initialize();

    mainAppWindow.windowObject.webContents.openDevTools();

    mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // we add the windowObject to the global and static properties of the class that created them
        mainAppWindow.addToWindowObjects();
        
        mainAppWindow.windowObject.webContents.send("app-window-details", {
            AppWindowId : mainAppWindow.windowId,
            AppWindow : {
                isOnFullScreen : mainAppWindow.windowObject.isFullScreen(),
            }
        });
        
    });

    mainAppWindow.windowObject.webContents.on("reload", (e) => {
        console.log('window reloaded');
    });

    

    return mainAppWindow;

}