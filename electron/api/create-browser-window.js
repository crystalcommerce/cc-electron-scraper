const { ipcRenderer } = require("electron");
const session = require('electron').session;
const CcBrowserWindow = require("../classes/cc-browser-window");
const { isFile } = require("../../utilities");


module.exports = function (payload, appObject, callback = () => {}, selectedBrowserSignature = "chrome") {

    if(!appObject.ready)    {
        callback(false);
    }
    
    let {AppWindowId, componentId, browserWindowId, url} = payload,
        browserWindow = new CcBrowserWindow(AppWindowId, componentId, browserWindowId, url);
        
    browserWindow.initialize();

    browserWindow.setViewedFrame({prevFrame : false, callback});

    browserWindow.windowObject.webContents.on("did-finish-load", (e) => {

        // cookie session
        session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

        // user agent string...
        if(selectedBrowserSignature === "chrome")    {
            browserWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
        } else if(selectedBrowserSignature === "firefox")   {
            browserWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
        } else  {
            browserWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 Edg/91.0.864.59');
        } 

        // we add the windowObject to the global and static properties of the class that created them
        browserWindow.addToWindowObjects();

        // we send the id to its webContents
        browserWindow.windowObject.webContents.send('browserWindowId', browserWindow.windowId);

        //         
        browserWindow.windowObject.webContents.executeJavaScript(`
            if(!window.ccBrowserFavicon)   {
                window.ccBrowserFavicon = document.querySelector("link[rel~='icon']");
            }
            
            if (window.ccBrowserFavicon) {
                window.ccBrowserFavicon.href;
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