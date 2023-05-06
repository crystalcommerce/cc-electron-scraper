const { ipcRenderer } = require("electron");
const CcBrowserWindow = require("../classes/cc-browser-window");
const { isFile } = require("../../../utilities");

module.exports = function (payload, callback = () => {}) {
    
    let {AppWindowId, componentId, browserWindowId, url} = payload,
        browserWindow = new CcBrowserWindow(AppWindowId, componentId, browserWindowId, url);

    browserWindow.initialize();

    browserWindow.setViewedFrame({prevFrame : false, callback});

    browserWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // we add the windowObject to the global and static properties of the class that created them
        browserWindow.addToWindowObjects();

        
        browserWindow.windowObject.webContents.executeJavaScript(`
            const favicon = document.querySelector("link[rel~='icon']");
            if (favicon) {
                favicon.href;
            }
        `).then((iconUrl) => {
            browserWindow.windowObject.webContents.executeJavaScript('document.title')
                .then(label => {

                    const url = browserWindow.windowObject.webContents.getURL();

                    const object = {
                        AppWindowId : browserWindow.parentWindowId,
                        componentId : browserWindow.componentId,
                        browserWindowId : browserWindow.windowId,
                        label,
                        url : url.indexOf("file:") === 0 ? null : url,
                        icon : iconUrl
                    };

                    Object.keys(object).forEach(key => {
                        if(!object[key])    {
                            delete object[key];
                        }
                    });

                    browserWindow.parentWindowObject.windowObject.webContents.send("browser-tab-update", {
                        payload : object,
                    });

                })
                .catch(err => console.log(err)); // will output the favicon URL
        });

        

    });

    browserWindow.windowObject.webContents.on('did-navigate-in-page', (event, url, isMainFrame, pageTransitionType) => {
        if (pageTransitionType === 'forward' || pageTransitionType === 'backward') {
            // ignore back and forward button navigation
            return;
        }
    
        if (url === browserWindow.windowObject.webContents.getURL()) {
        // ignore hash changes and query string changes
            return;
        }
    
        // console.log('history.pushState event captured: ', url);
        browserWindow.windowObject.webContents.executeJavaScript('document.title')
            .then(label => {
                const object = {
                    AppWindowId : browserWindow.parentWindowId,
                    componentId : browserWindow.componentId,
                    browserWindowId : browserWindow.windowId,
                    label,
                    url,
                };

                browserWindow.parentWindowObject.windowObject.webContents.send("browser-tab-update", {
                    payload : object,
                });

            })
            .catch(err => console.log(err));
        
    });

    browserWindow.windowObject.webContents.on("did-stop-loading", (e) => {
        
    });

    browserWindow.windowObject.webContents.on('did-fail-load', (e, errorCode, errorDescription) => {
        
        // let urlStr = browserWindow.resourceLocation,
        //     googleUrl = "https://google.com/search?q=";
            
        // googleUrl += urlStr.split(" ").map(item => encodeURIComponent(item.trim())).filter(item => item !== "").join("+");

        // browserWindow.load(googleUrl);

    });

    return browserWindow;

}