const { BrowserView } = require("electron");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../../utilities");
    
class FrameWindow {

    constructor(parentWindowObject, resourceLocation, windowOptions = {})    {

        if(!parentWindowObject && parentWindowObject.type !== "app-window") {
            return;
        }

        this.windowObject = null;
        this.parentWindowObject = parentWindowObject;
        this.windowType = "frame-window";
        this.resourceLocation = resourceLocation && resourceLocation.trim() !== ""? resourceLocation : path.join(process.cwd(), "views", "blank.html");
        this.defaultOptions = {
            frame : false,
            webPreferences : {
                nodeIntegration : true,
                contextIsolation : false,
            }
        }
        this.windowOptions = null;
        // this.windowOptions = {
        //     ...this.defaultOptions,
        //     ...this.getWindowOptions(windowOptions)
        // };
        this.windowId = getUuid();
        this.loadMethod = this.getLoadMethod();

        if(!Array.isArray(global.windowObjects))    {
            global.windowObjects = [];
        }

        this.getWindowOptions(windowOptions);
    }

    static windowObjects = [];

    getLoadMethod()   {
        if(this.resourceLocation)   {
            return fileExists(this.resourceLocation) ? "loadFile" : "loadURL";
        }
    }

    getWindowOptions({width, height, paddingTop, paddingBottom, paddingLeft, paddingRight, offset})   {

        // if()

        return {
            width : options.width,
        }
    }

    addToWindowObjects()    {
        AppWindow.windowObjects.push(this);
        global.windowObjects.push(this);
    }

    removeFromWindowObjects()   {
        global.windowObjects.filter(item => item.windowId !== this.windowId);
        AppWindow.windowObjects.filter(item => item.windowId !== this.windowId);
    }

    registerEvents()    {
        // view.webContents.on("navigate", () => {
        //     console.log("We have navigated");
        // })
    
        // win.on('resize', () => {
        //     view.setBounds({ x: 0, y: 200, width: win.getContentBounds().width, height: win.getContentBounds().height - 200 })
        // })
    }

    setWindowObject()   {

        if(!this.windowOptions) {
            return;
        }

        this.windowObject = new BrowserView(this.windowOptions);

        this.windowObject.setBounds(this.windowOptions);

        this.registerEvents();

    }

    initialize()    {

        this.setWindowObject();

        this.windowObject.webContents[this.loadMethod](this.resourceLocation);

    }

    close() {
        this.windowObject.close();
        this.windowObject = null;
        this.removeFromWindowObjects();
        delete this;
    }

}
    
module.exports = FrameWindow;

