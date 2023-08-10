const { waitForCondition } = require("../../../utilities");
const clearUserData = require("./clear-user-data");
const session = require("electron").session;

async function evaluatePage({ ccScraperWindow, resourceUri, dataObject, uriPropName, closeOnEnd, noredirect, selectedBrowserSignature })   {
    try {

        let scrapingDone = false,
            selectedUri = null,
            responseStatusCodeError = false,
            failedLoadCount = 0,
            maxFailedLoadCount = 3,
            maxWaitTime = 70000;
            

        if(resourceUri) {
            selectedUri = resourceUri;
        } else if(dataObject && dataObject[uriPropName])    {
            selectedUri = dataObject[uriPropName];
        } else  {
            throw Error("No Uri was selected");
        }

        closeOnEnd = typeof closeOnEnd !== "undefined" ? closeOnEnd : false;
        noredirect = typeof noredirect !== "undefined" ? noredirect : false;
        selectedBrowserSignature = typeof selectedBrowserSignature !== "undefined" ? selectedBrowserSignature : "chrome";

        console.log({message : "loading uri", selectedUri});
        ccScraperWindow.load(selectedUri);

        /* *********************
        ************************

            Callbacks

        ************************
        ********************* */


        const preventDefaultFunction = (e) => {
            e.preventDefault();
        };
    
        const removeFinishLoadCallback = () => {
    
            ccScraperWindow.removeEvent("did-finish-load", didFinishLoadCallback);
    
            ccScraperWindow.windowObject.webContents.ipc.removeListener('document-ready', documentReadyCallback);
    
            ccScraperWindow.windowObject.webContents.ipc.removeListener("cc-scraping-result", scrapingResultCallback);
    
            ccScraperWindow.windowObject.webContents.ipc.removeListener("cc-scraping-wait-for-selectors-failed", waitForSelectorsFailedCallback);
    
        }
    
        const setBrowserSessionSignature = () => {
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
        };
    
        const documentReadyCallback = (e, data) => {
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
    
        };
    
        const scrapingResultCallback = async(e, data) => {
                
            if(data.payload.windowId === ccScraperWindow.windowId)   {
    
                if(!Array.isArray(data.payload.ccScrapingResult))   {
                    Object.assign(dataObject, data.payload.ccScrapingResult);
                } else  {
                    dataObject = data.payload.ccScrapingResult;
                }
                
            }
    
            scrapingDone = true;
            removeEventListeners();
            removeFinishLoadCallback();
            if(closeOnEnd && ccScraperWindow)  {
                await ccScraperWindow.close();
            }
    
        };
    
        const waitForSelectorsFailedCallback = async(e, data) => {
                
            let {currentWait} = data.payload;
    
            if(currentWait > 3) {
    
                scrapingDone = true;
                removeEventListeners();
                removeFinishLoadCallback();
    
                clearUserData();

                if(closeOnEnd && ccScraperWindow)  {
                    await ccScraperWindow.close();
                }
                
    
            } else  {
    
                console.log(data.payload);
                console.log("failed waiting");

                if(ccScraperWindow && ccScraperWindow.windowObject) {

                    ccScraperWindow.load(data.payload.url);

                } else  {

                    scrapingDone = true;
                    removeEventListeners();
                    removeFinishLoadCallback();
        
                    clearUserData();

                    if(closeOnEnd && ccScraperWindow)  {
                        await ccScraperWindow.close();
                    }

                }
    
            }
    
        };

        const failedLoadCallback = async (event, errorCode, errorDescription, validatedURL, isMainFrame) => {

            if (validatedURL === 'about:blank') {
                console.log('The page failed to load and is blank.');
            }

            await new Promise((resolve) => {
                let timeout = setTimeout(() => {
                    clearTimeout(timeout);
                    resolve();
                }, maxWaitTime);
            });

            if(ccScraperWindow && ccScraperWindow.windowObject && failedLoadCount < maxFailedLoadCount)    {
                // reload the page;

                ccScraperWindow.load(selectedUri);

            } else  {
                scrapingDone = true;
                removeEventListeners();
                removeFinishLoadCallback();

                clearUserData();

                if(closeOnEnd && ccScraperWindow)  {
                    await ccScraperWindow.close();
                }
            }

        }

        // event listeners removal
        const removeEventListeners = () => {
            if(!ccScraperWindow) {
                return;
            }
            let eventsArr = ["will-redirect", "will-navigate", "did-start-loading"];
    
            for(let event of eventsArr) {
    
                ccScraperWindow.removeEvent(event, preventDefaultFunction);
    
            }

            ccScraperWindow.removeEvent('did-stop-loading', failedLoadCallback);

            ccScraperWindow.removeEvent('did-fail-load', failedLoadCallback);

            ccScraperWindow.removeEvent('crashed', failedLoadCallback);
        };
    
        const didFinishLoadCallback = async (e) => {
    
            setBrowserSessionSignature();
              
            // ccScraperWindow.addEvent("will-navigate", preventDefaultFunction);
        
            ccScraperWindow.addEvent('did-start-loading', preventDefaultFunction);

            ccScraperWindow.windowObject.webContents.ipc.on('document-ready', documentReadyCallback);
    
            ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-wait-for-selectors-failed", waitForSelectorsFailedCallback);

            ccScraperWindow.windowObject.webContents.ipc.on("cc-scraping-result", scrapingResultCallback);
    
        }

        /* *********************
        ************************

            Events
            
        ************************
        ********************* */

        

        if(noredirect)  {

            ccScraperWindow.addEvent("will-redirect", preventDefaultFunction);

        }

        ccScraperWindow.addEvent('unresponsive', failedLoadCallback);

        ccScraperWindow.addEvent('did-stop-loading', failedLoadCallback);

        ccScraperWindow.addEvent('did-fail-load', failedLoadCallback);

        ccScraperWindow.removeEvent('crashed', failedLoadCallback);

        ccScraperWindow.addEvent("did-finish-load", didFinishLoadCallback);
        
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

module.exports = async function({ ccScraperWindow, resourceUri, dataObject, uriPropName, closeOnEnd, noredirect, selectedBrowserSignature })  {

    let result = await evaluatePage({ ccScraperWindow, resourceUri, dataObject, uriPropName, closeOnEnd, noredirect, selectedBrowserSignature });


    return result ? result : dataObject;
    
}