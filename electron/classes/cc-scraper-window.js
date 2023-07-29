const { BrowserWindow, screen } = require("electron");
const AppWindow = require("./app-window");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists, deleteFile, waitForCondition } = require("../../utilities");

    
class CcScraperWindow {

    constructor({AppWindowId, componentId, windowId, preloadedScript, scraperType, resourceLocation, windowIndex})    {

        // if(!AppWindowId || !componentId || !windowId) {
        //     return;
        // }

        // let foundBrowserWindow = CcScraperWindow.windowObjects.find(item => item.windowId === windowId);

        // if(foundBrowserWindow)  {
        //     return foundBrowserWindow;
        // }


        this.windowId = windowId ? windowId : getUuid();
        this.windowObject = null;
        // this.parentWindowObject = AppWindow.windowObjects.find(item => item.windowId === AppWindowId);

        // if(!this.parentWindowObject)    {
        //     return;
        // }

        // this.parentWindowId = this.parentWindowObject.windowId;
        this.componentId = componentId;
        this.windowType = "scraper-window";
        this.preloadedScript = preloadedScript;
        this.scraperType = scraperType;
        this.resourceLocation = resourceLocation && resourceLocation !== "" ? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.label = "";
        this.icon = null;
        this.windowOptions = {height : 0, width : 0, x : 0, y : 0};
        
        this.defaultOptions = {
            ...this.windowOptions,
            frame : false,
            show : false,
            height : 520,
            width : 1280,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
                preload : this.preloadedScript,
                contentSecurityPolicy: "default-src *;",
                webSecurity: false,
                // userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                // webSecurity: false
            }
        };
        this.windowStyles = {
            withPadding : true,
        };
        
        this.loadMethod = this.getLoadMethod();
        this.isHidden = true;

        if(!Array.isArray(global.windowObjects))    {
            global.windowObjects = [];
        }

        this.windowIndex = 0;
        this.getWindowIndex();

        this.addedEvents = [];

    }

    static windowObjects = [];

    static hideTimeout = null;

    static hideInterval = null;

    static processedHalted = false;

    static maxRows = 5;

    static maxOpenedWindows = 5;

    static maxColumns = CcScraperWindow.maxOpenedWindows;

    static getFilteredBrowserWindows(parentWindowId, componentId = null)  {
        
        if(componentId) {
            return CcScraperWindow.windowObjects.filter(item => item.parentWindowId === parentWindowId && item.componentId === componentId);
        } else  {
            return CcScraperWindow.windowObjects.filter(item => item.parentWindowId === parentWindowId);
        }
    
    }

    static getShownBrowserWindows(parentWindowId, componentId = null)    {

        if(componentId) {
            return CcScraperWindow.windowObjects.filter(item => !item.isHidden && item.parentWindowId === parentWindowId && componentId === item.componentId);
        } else  {
            return CcScraperWindow.windowObjects.filter(item => !item.isHidden && item.parentWindowId === parentWindowId);
        }
        

    }   

    static hideAllBrowserWindows(parentWindowId, componentId = null)    {
        
        let filteredBrowsers = CcScraperWindow.getFilteredBrowserWindows(parentWindowId, componentId);

        filteredBrowsers.forEach(item => item.hideWindow());
        
    }

    static verifyHiddenBrowsers(parentWindowId, callback, componentId = null)    {

        CcScraperWindow.exitPendingProcesses();

        let count= 0;

        CcScraperWindow.hideInterval = setInterval(() => {

            let shownFrameWindows = CcScraperWindow.getShownBrowserWindows(parentWindowId, componentId);
            
            count++;

            if(CcScraperWindow.processHalted)   {
                clearInterval(CcScraperWindow.hideInterval);
            }

            if(!shownFrameWindows.length)   {

                clearInterval(CcScraperWindow.hideInterval);

                CcScraperWindow.hideTimeout = setTimeout(() => {
                    callback();
                    clearTimeout(CcScraperWindow.hideTimeout);
                }, 200);
                
            }

        }, 10);

    }

    static exitPendingProcesses() {

        CcScraperWindow.processHalted = true;

        if(CcScraperWindow.hideTimeout) {
            clearTimeout(CcScraperWindow.hideTimeout);
        }

        if(CcScraperWindow.hideInterval)    {
            clearInterval(CcScraperWindow.hideInterval);
        }
    }

    static removeAllWindowObjects(AppWindowId, componentId = null, callback = () => {}) {

        CcScraperWindow.hideAllBrowserWindows(AppWindowId, componentId);
        CcScraperWindow.verifyHiddenBrowsers(AppWindowId, () => {

            let browserWindows = CcScraperWindow.getFilteredBrowserWindows(AppWindowId, componentId),
                interval = null;

            browserWindows.forEach(item => item.close());

            interval = setInterval(() => {
                
                if(!CcScraperWindow.getFilteredBrowserWindows(AppWindowId, componentId).length)   {
                    callback();
                    clearInterval(interval);
                }

            }, 10);

        }, componentId);

    }

    setPreloadedScript(preloadedScriptPath)    {
        this.preloadedScript = preloadedScriptPath;
        this.defaultOptions.webPreferences.preload = this.preloadedScript;
    }

    getWindowIndex()    {
        this.windowIndex = CcScraperWindow.windowObjects.length;
    }

    setWindowPosition() {
        /* 
            maxRows = 5;
            maxColumns = 10;
        
        */

        let index = this.windowIndex,
            rows = (CcScraperWindow.maxOpenedWindows) / CcScraperWindow.maxRows, // 10 / 5 = 2
            columns = (CcScraperWindow.maxOpenedWindows) / rows, // 10 / 2;
            { width : fullScreenWidth, height : fullScreenHeight } = screen.getPrimaryDisplay().workAreaSize,
            halfScreenWidth = fullScreenWidth / 2,
            halfScreenHeight = fullScreenHeight / 2,

            // selectedScreenWidth = halfScreenWidth > (this.optionsObject.width + 200) ? halfScreenWidth : fullScreenWidth;
            selectedScreenWidth = fullScreenWidth;


        let horizontalDistance = (selectedScreenWidth - this.defaultOptions.width) / (columns - 1),
            verticalDistance = (halfScreenHeight - this.defaultOptions.height) / (rows),
            columnIndex = index < columns ? index : index % columns,
            rowIndex = index < columns ? 0 : Math.floor(index / columns),
            left = selectedScreenWidth === fullScreenWidth ? horizontalDistance * columnIndex : halfScreenWidth + horizontalDistance * columnIndex,
            top = (verticalDistance * rowIndex) + 0;
        
        // return {
        //     top, 
        //     left,
        // }

        this.windowObject.setBounds({ x: left, y: top});
    }

    getLoadMethod()   {
        if(this.resourceLocation)   {
            return fileExists(this.resourceLocation) ? "loadFile" : "loadURL";
        }
    }

    hideWindow()    {
        this.isHidden = true;
        this.windowObject.hide();
    }

    showWindow()    {
        this.isHidden = false;
        this.windowObject.show();
    }

    openDevTools()  {
        this.windowObject.webContents.openDevTools();
    }

    closeDevTools() {
        this.windowObject.webContents.closeDevTools();
    }

    addToWindowObjects()    {
        let foundWindowObject = CcScraperWindow.windowObjects.find(item => item.windowId === this.windowId);

        if(!foundWindowObject)  {
            CcScraperWindow.windowObjects.push(this);
            global.windowObjects.push(this);
        }
    }

    removeFromWindowObjects()   {
        global.windowObjects = global.windowObjects.filter(item => item.windowId !== this.windowId);
        CcScraperWindow.windowObjects = CcScraperWindow.windowObjects.filter(item => item.windowId !== this.windowId);
    }

    initialize()    {

        this.windowObject = new BrowserWindow(this.defaultOptions);

        this.addToWindowObjects();

        this.setWindowPosition();

        this.load();

    }

    load(resourceLocation = null, loadMethod = "loadURL")  {
        if(resourceLocation)  {
            this.resourceLocation = resourceLocation;
            let currentLoadMethod = loadMethod ? loadMethod : this.loadMethod;
            this.windowObject.webContents[currentLoadMethod](this.resourceLocation);
        } else  {
            this.windowObject.webContents[this.loadMethod](this.resourceLocation);
        }
    }

    async close() {

        try {
            this.windowObject.close();
            await deleteFile(this.preloadedScript);
            this.removeFromWindowObjects();
            
        } catch(err)    {
            console.log(err.message);
        }

    }

    addEvent(eventName, callback, type = null)  {

        let foundEvent = this.addedEvents.find(item => item.eventName === eventName && item.callback === callback.name);

        if(!foundEvent)    {
            this.windowObject.webContents.on(eventName, callback);

            console.log({
                message : `New Event Added`,
                eventName,
                callback : callback.name,
                windowId : this.windowId,
            })

            this.addedEvents.push({
                eventName,
                callback : callback.name
            });
        }
        
    }

    removeEvent(eventName, callback)  {

        let foundEvent = this.addedEvents.find(item => item.eventName === eventName && item.callback === callback.name);

        if(foundEvent)    {
            this.addedEvents = this.addedEvents.filter(item => item.callback !== callback.name && item.eventName !== eventName);
        }

        this.windowObject.webContents.removeListener(eventName, callback);

    }

}
    
module.exports = CcScraperWindow;