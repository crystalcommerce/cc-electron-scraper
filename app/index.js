
const cluster = require("cluster");

function createWindow(pathLocation, windowType = "localFile", options = {}) {
    let win = new BrowserWindow({
            ...options,
            width: 800,
            height: 600,
            
            webPreferences: {
                nodeIntegration: true,
                preload : "document.body.style.zoom = .2"
            }
        }),
        method = windowType === "localFile" ? "loadFile" : "loadUrl";

    win[method](pathLocation);
}

const childProcess = require('child_process');

module.exports = function() {

    const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
    const path = require("path");


    app.whenReady().then(() => {


        console.log(process.pid);


        const win = new BrowserWindow({ 
            width: 2000, 
            height: 1200,
            minWidth : 960,
            minHeight : 777,
            frame : false,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
            }
        });

        console.log(process.type);

        
    
        // const view = new BrowserView({webPreferences: {
        //     nodeIntegration: true,
        //     preload : path.join(__dirname, "preload.js"),
        // }})
        win.loadFile("./views/index.html");
    
        
        
        // win.setBrowserView(view)
        // view.setBounds({ x: 0, y: 200, width: win.getContentBounds().width, height: win.getContentBounds().height - 200 })
        // view.webContents.loadURL('https://youtube.com');
        // win.webContents.openDevTools();
        // view.webContents.openDevTools();
    
        // view.webContents.on("navigate", () => {
        //     console.log("We have navigated");
        // })
    
        // win.on('resize', () => {
        //     view.setBounds({ x: 0, y: 200, width: win.getContentBounds().width, height: win.getContentBounds().height - 200 })
        // })
    
        
    
        // ipcMain.on("current-url", (e, url) => {
        //     win.webContents.send("current-url", url);
        // })
    
    
        // ipcMain.on("user-input", (e, userInput) => {
        //     e.preventDefault();
        //     console.log("Hello there...");
    
    
        //     let url  = urlConstructor(userInput);
    
        //     console.log(url);
    
    
        //     console.log(view.webContents.loadURL(url));
        //     win.webContents.send("current-url", url);
        // })
    
        ipcMain.on("close-application", (e, data) => {
            console.log(data);
            win.close();
            
        });
    
        ipcMain.on("minimize-application", (e, data) => {
            console.log(data);
            win.minimize();
        });
    
        ipcMain.on("full-screen-application", (e, data) => {
            win.setSimpleFullScreen(data.state);
        })

        ipcMain.on("new-app-instance", (e, data) => {
            console.log(data);

            childProcess.spawn(process.execPath, [app.getAppPath()]);
        })
    
    
    });
    
    
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    });

}

