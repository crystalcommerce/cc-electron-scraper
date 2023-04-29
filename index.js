const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./core/browser/api/create-app-window");
const AppWindow = require("./core/browser/classes/app-window");
const FrameWindow = require("./core/browser/classes/frame-window");
const createFrameWindow = require("./core/browser/api/create-frame-window");

const viewsPath = path.join(__dirname, "views", "index.html");

app.whenReady().then(() => {

    createAppWindow(viewsPath);

    // new app window;
    ipcMain.on("new-app-instance", () => {
       
        const appWindowObject = createAppWindow(viewsPath);

        console.log({
            message : "We are creating a new app window...",
            windowId : appWindowObject.windowId
        })
    });

    // closing application window
    ipcMain.on("close-application", (e, data) => {
        e.preventDefault();

        AppWindow.closeActiveWindows(data.windowId);
        
    });

    // minimizing application-window
    ipcMain.on("minimize-application", (e, data) => {
        e.preventDefault();

        let appWindowObject = AppWindow.windowObjects.find(item => data.windowId === item.windowId);
        appWindowObject.windowObject.minimize();
    }); 

    // toggling full and non-full screen of application window
    ipcMain.on("full-screen-application", (e, data) => {
        let appWindowObject = AppWindow.windowObjects.find(item => data.windowId === item.windowId);

        appWindowObject.windowObject.setSimpleFullScreen(data.state);
        e.sender.send("set-full-screen-state", {
            AppWindow : {
                isOnFullScreen : appWindowObject.windowObject.isFullScreen(),
            }   
        });
        
    });

    // get the assigned frame window
    ipcMain.on("get-frame-window", (e, data) => {

        let frameWindow = FrameWindow.windowObjects.find(item => item.parentWindowId === data.parentWindowId && item.windowId === data.windowId),
            messageData = null;

        try {

            if(!data)   {
                throw Error("No data");
            }

            if(frameWindow) {

                frameWindow.setWindowOptions(data.browserFrameDimensions);
                frameWindow.setViewedFrame();
    
                messageData = {
                    windowId : frameWindow.windowId,
                    statusOk : true,
                    message : "Frame Window was updated..."
                }
    
            } else  {
    
                let parentWindowObject = AppWindow.windowObjects.find(item => item.windowId === data.parentWindowId);
    
                if(!parentWindowObject)  {
                    throw Error("No Parent Window Object");
                }

                frameWindow = createFrameWindow(parentWindowObject, data.windowId, data.browserFrameDimensions);
    
                messageData = {
                    windowId : frameWindow.windowId,
                    statusOk : true,
                    message : "Frame Window was created..."
                }

            }

            e.sender.send("frame-window-details", messageData);

        } catch(err)    {
            messageData = {
                statusOk : false,
                message : err.message,
            }
        }

        console.log(data);

        e.sender.send("frame-window-details", messageData);
        
    });

    ipcMain.on("reload-app-window", (e, data) => {

        FrameWindow.removeAllWindowObjects(data);

    });

    // sample
    ipcMain.on("renderer-button-click", (e, data) => {

        e.sender.openDevTools();

    });

    // ipcMain.on("frame-window-id", (e, data) => {
    //     // console.log("this fired...");
    //     // console.log(e.sender);
    //     // e.sender.send("frame-window-id", frameWindow.windowId)
    // });
    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
});