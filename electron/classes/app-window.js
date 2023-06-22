const { BrowserWindow } = require("electron");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../utilities");
const FrameWindowComponent = require("./frame-window-component");

    
class AppWindow {
    
    constructor(resourceLocation, windowOptions = {})    {
        this.windowObject = null;
        this.windowType = "app-window";
        this.resourceLocation = resourceLocation && resourceLocation.trim() !== ""? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.defaultOptions = {
            width: 1280, 
            height: 720,
            minWidth : 1280,
            minHeight : 720,
            frame : false,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
                // webSecurity: false,
            }
        }
        this.windowOptions = {
            ...this.defaultOptions,
            ...windowOptions
        }
        this.windowId = getUuid();
        this.loadMethod = this.getLoadMethod();

        if(!Array.isArray(global.windowObjects))    {
            global.windowObjects = [];
        }
    }

    static windowObjects = [];

    getLoadMethod()   {
        if(this.resourceLocation)   {
            return fileExists(this.resourceLocation) ? "loadFile" : "loadURL";
        }
    }

    addToWindowObjects()    {
        let foundWindowObject = AppWindow.windowObjects.find(item => item.windowId === this.windowId);
        if(!foundWindowObject)  {
            AppWindow.windowObjects.push(this);
            global.windowObjects.push(this);
        }
    }

    removeFromWindowObjects()   {
        global.windowObjects = global.windowObjects.filter(item => item.windowId !== this.windowId);
        AppWindow.windowObjects = AppWindow.windowObjects.filter(item => item.windowId !== this.windowId);
    }

    setWindowObject()   {

        this.windowObject = new BrowserWindow(this.windowOptions);

        this.windowObject[this.loadMethod](this.resourceLocation);

    }

    initialize()    {
        this.setWindowObject();
    }

    close() {
        this.removeFromWindowObjects();
        this.windowObject.close();

        this.windowObject = null;
        delete this;
    }

    static closeActiveWindows(windowId)  {

        let appWindowObjects = AppWindow.windowObjects.filter(item => windowId === item.windowId);
        
        FrameWindowComponent.removeAllComponentObjects(windowId, () => {
            appWindowObjects.forEach(item => {
                item.close();
            });
        });

    }

}
    
module.exports = AppWindow;

