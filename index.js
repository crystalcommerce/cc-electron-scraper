const { app, ipcMain } = require("electron");
const path = require("path");
const createAppWindow = require("./core/browser/api/create-app-window");
const AppWindow = require("./core/browser/classes/app-window");
const FrameWindow = require("./core/browser/classes/frame-window");
const getFrameWindow = require("./core/browser/events/getFrameWindow");
const removeReload = require("./config/remove-reload");

const childProcess = require('child_process');


const viewsPath = path.join(__dirname, "views", "index.html");
removeReload();
let appObject = {
    ready : true,
};

app.whenReady().then(() => {

    createAppWindow(viewsPath);

    /* APP WINDOW EVENTS */

    // new app;
    ipcMain.on("new-app-instance", () => {

        // childProcess.spawn(process.execPath, [app.getAppPath()], {stdio: 'inherit'});
       
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
    
    // reloading the application
    ipcMain.on("reload-app-window", (e, data) => {

        appObject.ready = false;

        FrameWindow.exitPendingProcesses();

        FrameWindow.removeAllWindowObjects(data);

        let interval = setInterval(() => {

            let frameWindows = FrameWindow.windowObjects.filter(item => item.parentWindowId === data);

            if(!frameWindows.length)   {
                clearInterval(interval);
                appObject.ready = true;
                e.sender.send("app-is-ready", {
                    message : "App was reloaded and is now ready...",
                });

                FrameWindow.processHalted = false;
            }

        }, 100);

    });

    /* FRAME WINDOW EVENTS */

    // get the assigned frame window
    ipcMain.on("get-frame-window", (e, data) => {

        let interval = setInterval(() => {
            
            if(appObject.ready) {
                clearInterval(interval);

                getFrameWindow(e, data);

            }

        }, 100);
        
    });

    // hide frame window event;
    ipcMain.on("hide-frame-windows", (e, data) => {
        FrameWindow.hideAllFrameWindows(data.parentWindowId);
        FrameWindow.verifyHiddenFrames(data.parentWindowId, () => {
            e.sender.send("active-frames-hidden", {
                message : "all active frames are hidden",
                AppWindowId : data.parentWindowId,
                nextPage : data.nextPage
            });
        });

    });



    /* BROWSER WINDOW EVENTS */

    // create browser;
    ipcMain.on("create-browser-window", (e, data) => {
        
        // console.log(FrameWindow.windowObjects.find(item => item.windowId === data.payload.parentWindowId));

        // console.log(data);


        console.log(payload);

        setTimeout(() => {
            e.sender.send("browser-window-created", {
                message : "Browser Window has been created",
                payload : data.payload,
            });
        }, 1500);

        // setTimeout(() => {
        //     e.sender.send("browser-window-created", {});
        // }, 1500);
        
        
    });

    // close browser;
    ipcMain.on("close-browser-window", (e, data) => {
        console.log(data.payload);
        setTimeout(() => {
            e.sender.send("browser-window-closed", {
                message : "Browser Window has been closed",
                payload : data.payload,
            });
        }, 1500);
        

    });

    // update browser - hide, show, and load url;
    ipcMain.on("set-active-browser-window", (e, data) => {
        console.log(data.payload);
        setTimeout(() => {
            e.sender.send("browser-window-set-active", {
                message : "Browser Window has been set to active",
                payload : data.payload,
            });
        }, 1500);
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