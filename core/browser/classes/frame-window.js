const { BrowserView } = require("electron");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../../utilities");
    
class FrameWindow {

    constructor(parentWindowObject, windowId, windowOptions = {})    {

        if(!parentWindowObject || parentWindowObject.windowType !== "app-window") {
            return;
        }

        this.windowObject = null;
        this.parentWindowObject = parentWindowObject;
        this.parentWindowId = parentWindowObject.windowId;
        this.windowType = "frame-window";
        this.resourceLocation = path.join(process.cwd(), "views", "blank.html");
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
        this.isHidden = true;

        if(!Array.isArray(global.windowObjects))    {
            global.windowObjects = [];
        }

        if(windowOptions)   {
            this.setWindowOptions(windowOptions)
        }
    }

    static windowObjects = [];

    static hideTimeout = null;

    static hideInterval = null;

    static processHalted = false;

    static hideAllFrameWindows(parentWindowId = null)    {

        let arr = parentWindowId ? FrameWindow.windowObjects.filter(item => item.parentWindowId === parentWindowId) : FrameWindow.windowObjects;

        arr.forEach(item => {
            item.hideWindow();
        });
        
    }

    static verifyHiddenFrames(parentWindowId, callback)    {

        FrameWindow.exitPendingProcesses();

        let count= 0;

        FrameWindow.hideInterval = setInterval(() => {

            let shownFrameWindows = FrameWindow.windowObjects.filter(item => !item.isHidden && item.parentWindowId === parentWindowId);
            
            count++;

            if(FrameWindow.processHalted)   {
                clearInterval(FrameWindow.hideInterval);
            }

            if(!shownFrameWindows.length)   {

                clearInterval(FrameWindow.hideInterval);

                FrameWindow.hideTimeout = setTimeout(() => {
                    callback();
                    clearTimeout(FrameWindow.hideTimeout);
                }, 500);
                
            }

        }, 10);

    }

    
    static exitPendingProcesses() {

        FrameWindow.processHalted = true;

        if(FrameWindow.hideTimeout) {
            clearTimeout(FrameWindow.hideTimeout);
        }

        if(FrameWindow.hideInterval)    {
            clearInterval(FrameWindow.hideInterval);
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

    setWindowDimensions()   {
        this.windowObject.setBounds(this.windowOptions);
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
        FrameWindow.windowObjects.push(this);
        global.windowObjects.push(this);
    }

    removeFromWindowObjects()   {
        global.windowObjects = global.windowObjects.filter(item => item.windowId !== this.windowId);
        FrameWindow.windowObjects = FrameWindow.windowObjects.filter(item => item.windowId !== this.windowId);
    }

    setViewedFrame(prevFrame = false)   {

        this.hideWindow();

        if(!prevFrame)   {
            this.parentWindowObject.windowObject.addBrowserView(this.windowObject);   
        }
        FrameWindow.hideAllFrameWindows(this.parentWindowId);
        FrameWindow.verifyHiddenFrames(this.parentWindowId, this.showWindow.bind(this));

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

        let frameWindows = FrameWindow.windowObjects.filter(item => item.parentWindowId === AppWindowId);

        frameWindows.forEach(item => item.close())

    }
    

}
    
module.exports = FrameWindow;

