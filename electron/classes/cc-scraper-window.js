const { BrowserView } = require("electron");
const AppWindow = require("./app-window");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../utilities");
const FrameWindowComponent = require("./frame-window-component");

    
class CcScraperWindow {

    constructor(AppWindowId, componentId, windowId, preloadedScript, resourceLocation = null)    {

        if(!AppWindowId || !componentId || !windowId) {
            return;
        }

        let foundBrowserWindow = CcScraperWindow.windowObjects.find(item => item.windowId === windowId);

        if(foundBrowserWindow)  {
            return foundBrowserWindow;
        }


        this.windowId = windowId ? windowId : getUuid();
        this.windowObject = null;
        this.parentWindowObject = AppWindow.windowObjects.find(item => item.windowId === AppWindowId);

        if(!this.parentWindowObject)    {
            return;
        }

        this.parentWindowId = this.parentWindowObject.windowId;
        this.componentId = componentId;
        this.windowType = "scraper-window";
        this.resourceLocation = resourceLocation && resourceLocation !== "" ? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.label = "";
        this.icon = null;
        this.windowOptions = {height : 0, width : 0, x : 0, y : 0};
        this.preloadedScript = preloadedScript;
        this.defaultOptions = {
            ...this.windowOptions,
            frame : false,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
                preload : path.join(process.cwd(), "scripts", "sample.js"),
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

    static processHalted = false; // will be used when the app is reloaded

    static maxOpenedWindows = 20;

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

    getLoadMethod()   {
        if(this.resourceLocation)   {
            return fileExists(this.resourceLocation) ? "loadFile" : "loadURL";
        }
    }

    setWindowOptions(options)   {
        let width, height, x, y;
        if(this.windowStyles.withPadding)    {
            width = Math.round(options.width - (options.paddingLeft + options.paddingRight));
            height = Math.round(options.height - (options.paddingTop + options.paddingBottom));
            x = Math.round(options.offsetLeft + options.paddingLeft);
            y = Math.round(options.offsetTop + options.paddingTop);
        } else  {
            width = options.width ? Math.round(options.width) : 0;
            height = options.height ? Math.round(options.height) : 0;
            x = options.offsetLeft ? Math.round(options.offsetLeft) : 0;
            y = options.offsetTop ? Math.round(options.offsetTop) : 0;
        }
        
        this.windowOptions = {
            width,
            height,
            x,
            y,
        }
    }
    
    getWindowOptions()  {
        let foundFrameWindowComponent = FrameWindowComponent.getFrameWindowComponent(this.parentWindowId, this.componentId);

        if(foundFrameWindowComponent)   {
            this.setWindowOptions(foundFrameWindowComponent.dimensions);
        }
    }

    setWindowDimensions()   {
        this.getWindowOptions();
        if(!this.isHidden)  {
            this.windowObject.setBounds(this.windowOptions);
        }
    }

    hideWindow()    {
        this.isHidden = true;
        this.windowObject.setBounds({x : 0, y : 0, width : 0, height : 0});
    }

    showWindow()    {
        this.isHidden = false;
        this.windowObject.setBounds(this.windowOptions);
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

    setViewedFrame({prevFrame, callback})   {

        this.hideWindow();

        if(!prevFrame)   {
            this.parentWindowObject.windowObject.addBrowserView(this.windowObject);   
        }
        this.setWindowDimensions();

        this.showWindow();

        this.load();

        callback();

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

    initialize()    {

        this.windowObject = new BrowserView(this.defaultOptions);

    }

    close() {
        this.hideWindow();
        this.removeFromWindowObjects();
        this.parentWindowObject.windowObject.removeBrowserView(this.windowObject);
        // this.windowObject = null;
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

}
    
module.exports = CcScraperWindow;