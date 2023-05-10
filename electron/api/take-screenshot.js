const { BrowserWindow } = require("electron");

module.exports = function(AppWindowId) {
    const hiddenWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // Hide the window initially
    });
    
    // Load the desired website
    hiddenWindow.loadURL('https://example.com');
    
    // Wait for the page to finish loading
    hiddenWindow.webContents.on('did-finish-load', () => {
        // Take a screenshot
        hiddenWindow.webContents.capturePage().then((image) => {
        // Get the data URL of the screenshot
            const dataURL = image.toDataURL();
    
        // Print the data URL to the console
            console.log(dataURL);
            
            hiddenWindow.webContents.send("screen-shot-taken", {payload : {
                dataURL
            }});
            
        });
    });

    hiddenWindow.on("close-browser-window", (e, data) => {
        hiddenWindow.close();
    });
    
}