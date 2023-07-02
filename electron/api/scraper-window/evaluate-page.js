const { waitForCondition } = require("../../../utilities");
const clearUserData = require("./clear-user-data");
const session = require("electron").session;

module.exports = async function({ ccScraperWindow, resourceUri, dataObject, uriPropName, closeOnEnd })  {

    try {

        let scrapingDone = false;
            selectedUri = null;

        if(resourceUri) {
            selectedUri = resourceUri;
        } else if(dataObject && dataObject[uriPropName])    {
            selectedUri = dataObject[uriPropName];
        } else  {
            throw Error("No Uri was selected");
        }

        closeOnEnd = closeOnEnd ? closeOnEnd : false;

        console.log({message : "loading uri"})
        ccScraperWindow.load(selectedUri);

        const preventDefaultFunction = (e) => {
            e.preventDefault();
        }

        const removeEventListeners = () => {
            let eventsArr = ["will-redirect", "will-navigate", "did-start-loading"];

            for(let event of eventsArr) {

                ccScraperWindow.windowObject.webContents.removeListener(event, preventDefaultFunction);

            }
        }

        ccScraperWindow.windowObject.webContents.on("will-redirect", preventDefaultFunction);

        ccScraperWindow.windowObject.webContents.once("did-finish-load", async (e) => {
            // cookie session
            session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

            // user agent string...
            ccScraperWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36');

            ccScraperWindow.windowObject.webContents.on("will-navigate", preventDefaultFunction);
        
            ccScraperWindow.windowObject.webContents.on('did-start-loading', preventDefaultFunction);

            // ccScraperWindow.windowObject.webContents.on('ipc-message', (event, channel, data) => {
            ccScraperWindow.windowObject.webContents.ipc.on('document-ready', (e, data) => {
                // Handle the received IPC message
                // console.log(`Received IPC message from renderer: document-ready`);

                ccScraperWindow.windowObject.webContents.send("scraper-window-details", {
                    ccScraperWindow : {
                        AppWindowId : ccScraperWindow.AppWindowId,
                        windowId : ccScraperWindow.windowId,
                        componentId : ccScraperWindow.componentId,
                        scraperType : ccScraperWindow.scraperType,
                    },
                    ccDataProps : {
                        ...dataObject,
                    },
                });

            });

            ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-result", async(e, data) => {
                
                if(data.payload.windowId === ccScraperWindow.windowId)   {
                    Object.assign(dataObject, data.payload.ccScrapingResult);
                }

                scrapingDone = true;
                removeEventListeners();
                if(closeOnEnd)  {
                    await ccScraperWindow.close();
                }

            });


            ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-wait-for-selectors-failed", async(e, data) => {
                
                let {currentWait} = data.payload;

                if(currentWait > 3) {

                    scrapingDone = true;
                    removeEventListeners();
                    clearUserData();
                    await ccScraperWindow.close();

                } else  {

                    console.log(data.payload);
                    console.log("failed waiting");

                    ccScraperWindow.load(data.payload.url);

                }

            });

        });

        await waitForCondition({
            conditionCallback : () => scrapingDone,
            onTrueCallback : () => {
                console.log({message : "scraping is done... and we're closing the browser", scrapingDone, dataObject});
                
            },
        });


        return dataObject;


    } catch(err)    {

        console.log(err.message);

    }
    
}