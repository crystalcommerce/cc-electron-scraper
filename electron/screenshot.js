const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Create a new Electron app
app.on('ready', () => {
    // Create a new browser window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false, // Hide the window initially
    });

    // Load the desired website
    mainWindow.loadURL('https://example.com');

    // Wait for the page to finish loading
    mainWindow.webContents.on('did-finish-load', () => {
        // Take a screenshot
        mainWindow.webContents.capturePage().then((image) => {
        // Get the data URL of the screenshot
            const dataURL = image.toDataURL();

        // Print the data URL to the console
            // console.log(dataURL);

        // Close the Electron app
            // app.quit();
        });
    });
    
});

// Run the Electron app
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});