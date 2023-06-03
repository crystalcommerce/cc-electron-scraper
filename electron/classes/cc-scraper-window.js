const { BrowserWindow } = require("electron");
const AppWindow = require("./app-window");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../utilities");

    
class CcScraperWindow {

    constructor({AppWindowId, componentId, windowId, preloadedScript, scraperType, resourceLocation})    {

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
            height : 500,
            width : 1200,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
                preload : this.preloadedScript,
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

    }

    static windowObjects = [];

    static hideTimeout = null;

    static hideInterval = null;

    static processedHalted = false;

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

    close() {
        this.hideWindow();
        this.removeFromWindowObjects();
        this.windowObject.close();
        // this.windowObject = null;
    }

}
    
module.exports = CcScraperWindow;