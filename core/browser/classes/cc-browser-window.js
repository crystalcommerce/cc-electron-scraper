const { BrowserView } = require("electron");
const AppWindow = require("./app-window");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../../utilities");
const FrameWindowComponent = require("./frame-window-component");

    
class CcBrowserWindow {

    constructor(AppWindowId, componentId, windowId, resourceLocation = null)    {

        if(!AppWindowId || !componentId || !windowId) {
            return;
        }
        this.windowId = windowId ? windowId : getUuid();
        this.windowObject = null;
        this.parentWindowObject = AppWindow.windowObjects.find(item => item.windowId === AppWindowId);

        if(!this.parentWindowObject)    {
            return;
        }

        this.parentWindowId = this.parentWindowObject.windowId;
        this.componentId = componentId;
        this.windowType = "browser-window";
        this.resourceLocation = resourceLocation && resourceLocation !== "" ? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.label = "";
        this.icon = null;
        this.windowOptions = {height : 0, width : 0, x : 0, y : 0};
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

    static getFilteredBrowserWindows(parentWindowId, componentId = null)  {
        return CcBrowserWindow.windowObjects.filter(item => {
            return componentId ? 
                item.parentWindowId === parentWindowId && item.componentId === componentId : 
                item.parentWindowId === parentWindowId;
        });
    }

    static getShownBrowserWindows(parentWindowId, componentId = null)    {
        return CcBrowserWindow.windowObjects.filter(item => {
            return componentId ? 
                !item.isHidden && item.parentWindowId === parentWindowId && componentId === item.componentId :
                !item.isHidden && item.parentWindowId === parentWindowId;
        });
    }   

    static hideAllBrowserWindows(parentWindowId, componentId = null)    {

        let arr = CcBrowserWindow.getFilteredBrowserWindows(parentWindowId, componentId = null)

        arr.forEach(item => {
            item.hideWindow();
        });
        
    }

    static verifyHiddenBrowsers(parentWindowId, callback, componentId)    {

        CcBrowserWindow.exitPendingProcesses();

        let count= 0;

        CcBrowserWindow.hideInterval = setInterval(() => {

            let shownFrameWindows = CcBrowserWindow.getShownBrowserWindows(parentWindowId, componentId);
            
            count++;

            if(CcBrowserWindow.processHalted)   {
                clearInterval(CcBrowserWindow.hideInterval);
            }

            if(!shownFrameWindows.length)   {

                clearInterval(CcBrowserWindow.hideInterval);

                CcBrowserWindow.hideTimeout = setTimeout(() => {
                    callback();
                    clearTimeout(CcBrowserWindow.hideTimeout);
                }, 500);
                
            }

        }, 10);

    }

    static exitPendingProcesses() {

        CcBrowserWindow.processHalted = true;

        if(CcBrowserWindow.hideTimeout) {
            clearTimeout(CcBrowserWindow.hideTimeout);
        }

        if(CcBrowserWindow.hideInterval)    {
            clearInterval(CcBrowserWindow.hideInterval);
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
        this.windowObject.setBounds({x : Math.round((this.parentWindowObject.windowObject.getBounds().x * 100)), y : Math.round((this.parentWindowObject.windowObject.getBounds().y * 100)), width : 0, height : 0});
    }

    showWindow()    {
        this.isHidden = false;
        this.windowObject.setBounds(this.windowOptions);
    }

    addToWindowObjects()    {
        CcBrowserWindow.windowObjects.push(this);
        global.windowObjects.push(this);
    }

    removeFromWindowObjects()   {
        global.windowObjects = global.windowObjects.filter(item => item.windowId !== this.windowId);
        CcBrowserWindow.windowObjects = CcBrowserWindow.windowObjects.filter(item => item.windowId !== this.windowId);
    }

    setViewedFrame({prevFrame, callback})   {

        this.hideWindow();

        if(!prevFrame)   {
            this.parentWindowObject.windowObject.addBrowserView(this.windowObject);   
        }
        CcBrowserWindow.hideAllBrowserWindows(this.parentWindowId);
        CcBrowserWindow.verifyHiddenBrowsers(this.parentWindowId, () => {

            this.setWindowDimensions();

            this.showWindow();

            this.load();

            callback(); // will be used to send data to the rendrer...

        });

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

        // this.parentWindowObject.windowObject.setBrowserView(null);

        this.hideWindow();
        this.parentWindowObject.windowObject.removeBrowserView(this.windowObject);
        
    }


    static removeAllWindowObjects(AppWindowId, componentId = null, callback = () => {}) {
        
        CcBrowserWindow.hideAllBrowserWindows(AppWindowId);
        CcBrowserWindow.verifyHiddenBrowsers(AppWindowId, () => {
            
            let browserWindows = CcBrowserWindow.windowObjects.filter(item => {
                    return componentId ? 
                        item.parentWindowId === AppWindowId && item.componentId === componentId : 
                        item.parentWindowId === AppWindowId;
                }),
                timeout = null;

            browserWindows.forEach(item => {
                Object.keys(item).forEach(key => {
                    item[key] = null;
                });
                item = null;
            });

            function finalFunction() {
                clearInterval(timeout);
                console.log("finalFunction was called...");
                if(browserWindows.every(item => {
                    return Object.keys(item).every(key => item[key] === null)
                })) {
                    // callback();
                } else  {
                    timeout = setTimeout(() => {

                        finalFunction();
                    }, 500);
                }
            }
            
            setTimeout(() => finalFunction(), 500);

        });

    }

}
    
module.exports = CcBrowserWindow;