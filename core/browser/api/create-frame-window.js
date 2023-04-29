const FrameWindow = require("../classes/frame-window");

module.exports = function(parentWindowObject, windowId, windowOptions = {}) {

    let frameWindow = new FrameWindow(parentWindowObject, windowId, windowOptions);

    frameWindow.initialize();

    // frameWindow.windowObject.webContents.openDevTools();

    frameWindow.addToWindowObjects();

    frameWindow.windowObject.webContents.on("did-finish-load", (e) => {

        frameWindow.windowObject.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
            callback(true);
        });
        

        frameWindow.windowObject.webContents.session.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');

    });
    
    frameWindow.windowObject.webContents.on("will-navigate", (e, url) => {

        e.preventDefault();

        // shell.openExternal(url);
        frameWindow.load(url);
        
        // console.log(frameWindow);

    });

    

    return frameWindow;
}