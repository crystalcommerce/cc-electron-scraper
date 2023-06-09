const { waitForCondition } = require("../../../utilities");
const session = require("electron").session;

module.exports = async function({ ccScraperWindow, productObject, uriPropName, uniquePropName, closeOnEnd })  {
    let scrapingDone = false;

    closeOnEnd = closeOnEnd ? closeOnEnd : false;

    ccScraperWindow.load(productObject[uriPropName]);

    ccScraperWindow.windowObject.webContents.once("did-finish-load", async (e) => {
        // cookie session
        session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

        // user agent string...
        ccScraperWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

        ccScraperWindow.windowObject.webContents.on("will-navigate", (e) => {
            e.preventDefault();
        });
    
        ccScraperWindow.windowObject.webContents.on('did-start-loading', (e) => {
            e.preventDefault();
        });

        ccScraperWindow.windowObject.webContents.on("will-redirect", (e) => {
            e.preventDefault();
            console.log("page will redirect");
        });

        // ccScraperWindow.windowObject.webContents.on('ipc-message', (event, channel, data) => {
        ccScraperWindow.windowObject.webContents.ipc.on('document-ready', (e, data) => {
            // Handle the received IPC message
            console.log(`Received IPC message from renderer: document-ready`);

            ccScraperWindow.windowObject.webContents.send("scraper-window-details", {
                ccScraperWindow : {
                    AppWindowId : ccScraperWindow.AppWindowId,
                    windowId : ccScraperWindow.windowId,
                    componentId : ccScraperWindow.componentId,
                    scraperType : ccScraperWindow.scraperType,
                },
                ccDataProps : {
                    ...productObject,
                },
            });

        });

        ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-result", async(e, data) => {
            console.log({
                scrapingResultMessage : "Here's the scraping result",
                ...data
            });


            // productObject = {...productObject, ...data.ccScrapingResult};
            scrapingDone = true;
            if(data.payload.ccScrapingResult[uniquePropName] === productObject[uniquePropName])   {
                Object.assign(productObject, data.payload.ccScrapingResult);
            }
            

            if(closeOnEnd)  {
                ccScraperWindow.close();
            }

        });

    });

    await waitForCondition({
        conditionCallback : () => scrapingDone,
        onTrueCallback : () => console.log({message : "scraping is done... and we're closing the browser", scrapingDone, productObject}),
    });

    return productObject;

}