const { BrowserView } = require("electron");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../../utilities");


class CcBrowserWindow {

    constructor(parentWindowObject, windowId, resourceLocation, windowOptions = {})   {
        if(!parentWindowObject || parentWindowObject.windowType !== "app-window") {
            return;
        }

        this.windowObject = null;
        this.parentWindowObject = parentWindowObject;
        this.parentWindowId = parentWindowObject.windowId;
        this.windowType = "frame-window";
        this.resourceLocation = resourceLocation ? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.defaultOptions = {
            frame : false,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
                preload : path.join(process.cwd(), "scripts", "sample.js")
            }
        };
        this.windowStyles = {
            withPadding : true,
        }
        this.windowOptions = {height : 0, width : 0, x : 0, y : 0};
        this.windowId = windowId ? windowId : getUuid();
        this.loadMethod = this.getLoadMethod();

        if(!Array.isArray(global.windowObjects))    {
            global.windowObjects = [];
        }

        if(windowOptions)   {
            this.setWindowOptions(windowOptions)
        }
    }




    static windowObjects = [];

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

    setWindowDimensions()   {
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

    setViewedFrame(prevFrame = false)   {

        if(prevFrame)   {
            
            if(this.windowOptions.height === 0) {
                this.parentWindowObject.windowObject.setBrowserView(null);
                this.setWindowDimensions();
            }   else    {
                this.parentWindowObject.windowObject.setBrowserView(this.windowObject);
                this.setWindowDimensions();
            }
        } else  {
            this.parentWindowObject.windowObject.setBrowserView(this.windowObject);

            this.setWindowDimensions();
        }

        // if(this.windowOptions.height === 0) {

        //     this.parentWindowObject.windowObject.removeBrowserView(this.windowObject);

        // } else  {
        //     this.parentWindowObject.windowObject.addBrowserView(this.windowObject);
            
        //     this.setWindowDimensions();
        // }

    }

    setWindowObject()   {
        
        this.windowObject = new BrowserView(this.defaultOptions);
        
        this.setViewedFrame();

    }

    load(resourceLocation = null, loadMethod = "loadURL")  {
        if(resourceLocation)  {
            let currentLoadMethod = loadMethod ? loadMethod : this.loadMethod;
            this.windowObject.webContents[currentLoadMethod](resourceLocation);
        } else  {
            this.windowObject.webContents[this.loadMethod](this.resourceLocation);
        }
    }

    initialize()    {

        this.setWindowObject();

        this.load();

    }

    close() {

        // this.parentWindowObject.windowObject.removeBrowserView(this.windowObject);
        this.parentWindowObject.windowObject.setBrowserView(null);
        this.removeFromWindowObjects();
        this.windowObject = null;
        delete this;
    }


    static removeAllWindowObjects(AppWindowId) {

        let frameWindows = CcBrowserWindow.windowObjects.filter(item => item.parentWindowId === AppWindowId);

        frameWindows.forEach(item => item.close())

    }


}

module.exports = CcBrowserWindow;