const { waitForCondition } = require("../../../utilities");
const clearUserData = require("./clear-user-data");
const session = require("electron").session;
const {URL} = require("url");

module.exports = async function({ ccScraperWindow, resourceUri, dataObject, uriPropName, closeOnEnd, noredirect, selectedBrowserSignature })  {

    try {

        let scrapingDone = false,
            selectedUri = null,
            responseStatusCodeError = false;

        if(resourceUri) {
            selectedUri = resourceUri;
        } else if(dataObject && dataObject[uriPropName])    {
            selectedUri = dataObject[uriPropName];
        } else  {
            throw Error("No Uri was selected");
        }

        closeOnEnd = typeof closeOnEnd !== "undefined" ? closeOnEnd : false;
        noredirect = typeof noredirect !== "undefined" ? noredirect : true;
        selectedBrowserSignature = typeof selectedBrowserSignature !== "undefined" ? selectedBrowserSignature : "chrome";

        console.log({message : "loading uri"})
        ccScraperWindow.load(selectedUri);

        const preventDefaultFunction = (e) => {
            e.preventDefault();
        }

        const removeEventListeners = (ccScraperWindow) => {
            if(!ccScraperWindow) {
                return;
            }
            let eventsArr = ["will-redirect", "will-navigate", "did-start-loading"];

            for(let event of eventsArr) {

                ccScraperWindow.windowObject.webContents.removeListener(event, preventDefaultFunction);

            }
        }

        if(noredirect)  {
            ccScraperWindow.windowObject.webContents.once("will-redirect", preventDefaultFunction);
        }

        ccScraperWindow.windowObject.webContents.once("did-finish-load", async (e) => {

            // cookie session
            session.defaultSession.cookies.set({url: 'https://www.google.com', name: 'cookieName', value: 'cookieValue', domain: '.google.com'});

            // user agent string...
            if(selectedBrowserSignature === "chrome")    {
                ccScraperWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
            } else if(selectedBrowserSignature === "firefox")   {
                ccScraperWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
            } else  {
                ccScraperWindow.windowObject.webContents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36 Edg/91.0.864.59');
            }     
            

            ccScraperWindow.windowObject.webContents.once("will-navigate", preventDefaultFunction);
        
            ccScraperWindow.windowObject.webContents.once('did-start-loading', preventDefaultFunction);

            ccScraperWindow.windowObject.webContents.session.webRequest.onCompleted((details) => {
                // console.log({
                //     id : details.id,
                //     webContentsId : details.webContentsId,
                //     statusCode : details.statusCode,
                //     from : "request completed.."
                // });
            });

            ccScraperWindow.windowObject.webContents.session.webRequest.onErrorOccurred((details) => {
                // console.log({
                //     id : details.id,
                //     webContentsId : details.webContentsId,
                //     statusCode : details.statusCode,
                //     from : "error occured.."
                // });
                
                // scrapingDone = true;
                // responseStatusCodeError = true;
    
            });

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

                    if(!Array.isArray(data.payload.ccScrapingResult))   {
                        Object.assign(dataObject, data.payload.ccScrapingResult);
                    } else  {
                        dataObject = data.payload.ccScrapingResult;
                    }
                    
                }

                scrapingDone = true;
                removeEventListeners(ccScraperWindow);
                if(closeOnEnd && ccScraperWindow)  {
                    await ccScraperWindow.close();
                }

            });

            ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-wait-for-selectors-failed", async(e, data) => {
                
                let {currentWait} = data.payload;

                if(currentWait > 3) {

                    scrapingDone = true;
                    removeEventListeners(ccScraperWindow);
                    clearUserData();
                    if(ccScraperWindow) {
                        await ccScraperWindow.close();
                    }
                    

                } else  {

                    console.log(data.payload);
                    console.log("failed waiting");

                    ccScraperWindow.load(data.payload.url);

                }

            });

        });
        


        await waitForCondition({
            conditionCallback : () => scrapingDone,
            onTrueCallback : async () => {
                console.log({message : "scraping is done... and we're closing the browser", scrapingDone, dataObject});
            },
        });

        return dataObject;


    } catch(err)    {

        console.log(err.message);

    }
    
}