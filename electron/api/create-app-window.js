const AppWindow = require("../classes/app-window");
const session = require('electron').session;

module.exports = function ({resourceLocation, appAbsPath, userDataPath, serverUrl, selectedBrowserSignature}) {
    
    let mainAppWindow;

    mainAppWindow = new AppWindow(resourceLocation);

    mainAppWindow.initialize();

    selectedBrowserSignature = typeof selectedBrowserSignature !== "undefined" ? selectedBrowserSignature : "chrome";

    // mainAppWindow.windowObject.webContents.openDevTools();

    mainAppWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // cookie session
        session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

        // user agent string...
        if(selectedBrowserSignature === "chrome")    {
            mainAppWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
        } else if(selectedBrowserSignature === "firefox")   {
            mainAppWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
        } else  {
            mainAppWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 Edg/91.0.864.59');
        } 

        // we add the windowObject to the global and static properties of the class that created them
        mainAppWindow.addToWindowObjects();

        // /* App Window configurations */

        //     // cookie session
        //     session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

        //     // user agent string...
        //     mainAppWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

            
        
        mainAppWindow.windowObject.webContents.send("app-window-details", {
            AppWindowId : mainAppWindow.windowId,
            AppWindow : {
                isOnFullScreen : mainAppWindow.windowObject.isFullScreen(),
                userDataPath,
                serverUrl
            }
        });
        
    });

    return mainAppWindow;

}