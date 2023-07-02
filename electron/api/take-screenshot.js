const { BrowserWindow, nativeImage } = require("electron");
const AppWindow = require("../classes/app-window");
const sharp = require('sharp');
const session = require("electron").session;

module.exports = function(payload) {
    const hiddenWindow = new BrowserWindow({
        width: 1200,
        height: 1200,
        frame : false,
        show: false, // Hide the window initially
    });
    
    // Load the desired website

    hiddenWindow.loadURL(payload.siteUrl);
    
    // Wait for the page to finish loading
    hiddenWindow.webContents.on('did-finish-load', () => {
        // cookie session
        session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

        // user agent string...
        hiddenWindow.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

        // Take a screenshot
        hiddenWindow.webContents.capturePage()
            .then((image) => {
            // Get the data URL of the screenshot
                const dataUrl = image.toDataURL();
                const foundAppWindow = AppWindow.windowObjects.find(item => item.windowId === payload.AppWindowId);
        
                // Resize and process the data URL
                sharp(Buffer.from(dataUrl.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''), 'base64'))
                    .resize(250) // Set the desired width (height will be adjusted automatically)
                    .jpeg({ quality: 100 }) // Compress as JPEG with a quality of 80 (adjust as needed)
                    .toBuffer()
                    .then((resizedBuffer) => {
                        const resizedDataUrl = `data:image/png;base64,${resizedBuffer.toString('base64')}`;
                        
                        // Use the resized data URL with Electron's nativeImage
                        const siteScreenShot = resizedDataUrl;
                        
                        foundAppWindow.windowObject.webContents.send("screen-shot-taken", {payload : {
                            siteScreenShot,
                            screenshotWindowId : hiddenWindow.id,
                            ...payload
                        }});

                    })
                    .catch((error) => {
                        console.error('Error occurred during image processing:', error);
                    });

            });

    });

    hiddenWindow.on("close-browser-window", (e, data) => {
        hiddenWindow.close();
    });
    
}