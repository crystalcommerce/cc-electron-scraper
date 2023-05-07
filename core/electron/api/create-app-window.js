const AppWindow = require("../classes/app-window");
const session = require('electron').session;

module.exports = function (resourceLocation) {
    
    let mainAppWindow;

    mainAppWindow = new AppWindow(resourceLocation);

    mainAppWindow.initialize();

    mainAppWindow.windowObject.webContents.openDevTools();

    mainAppWindow.windowObject.webContents.on('ready-to-show', () => {

        // const session = mainAppWindow.windowObject.webContents.session;
        // const partition = session.partition;

        // session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
        //     callback({
        //         responseHeaders: {
        //             ...details.responseHeaders,
        //             'Access-Control-Allow-Origin': ['*'],
        //             'Access-Control-Allow-Methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
        //             'Access-Control-Allow-Headers': ['Content-Type', 'Authorization'],
        //         },
        //     });
        // });

    });

    mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // we add the windowObject to the global and static properties of the class that created them
        mainAppWindow.addToWindowObjects();

        /* App Window configurations */

            // cookie session
            session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

            // user agent string...
            mainAppWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

            
        
        mainAppWindow.windowObject.webContents.send("app-window-details", {
            AppWindowId : mainAppWindow.windowId,
            AppWindow : {
                isOnFullScreen : mainAppWindow.windowObject.isFullScreen(),
            }
        });
        
    });

    return mainAppWindow;

}