const { app, BrowserView, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const CcScraperWindow = require('./electron/classes/cc-scraper-window');

// console.log(app)
app.whenReady().then(() => {


    console.log(process.pid);


    let preloadedScript = path.join(__dirname, "electron", "scripts", "single-product-scraper.js"),
    // let preloadedScript = "document.body.style.zoom = .2; console.log('Michael Norward Miranda')",
        ccScraperWindow = new CcScraperWindow("dad876ae02067e-e1", null, null, preloadedScript, "single", null);


    ccScraperWindow.initialize();

    console.log(ccScraperWindow);
    console.log(ccScraperWindow.resourceLocation);

    ccScraperWindow.showWindow();

    new Promise((resolve) => {
        

        // console.log("hiding the window in three seconds");

        let timeout = setTimeout(() => {
            clearTimeout(timeout);

            // console.log("window will now be hidden");
            resolve();
        }, 3000);

        

    }).then(() => {
        ccScraperWindow.load("https://youtube.com");
        ccScraperWindow.windowObject.webContents.openDevTools();

        new Promise((resolve) => {
        

            console.log("hiding the window in three seconds");
    
            let timeout = setTimeout(() => {
                clearTimeout(timeout);
    
                console.log("window will now be hidden");
                resolve();
            }, 3000);
    
            
    
        }).then(() => {
            ccScraperWindow.hideWindow();

            new Promise((resolve) => {
        
                console.log("closing the window in three seconds");
        
                let timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    ccScraperWindow.showWindow();
        
                    console.log("window will now be closed");
                    resolve();
                }, 3000);
        
                
        
            }).then(() => {
                ccScraperWindow.close();
            })

        });
    })


});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});