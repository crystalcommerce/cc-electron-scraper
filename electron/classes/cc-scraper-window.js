const { BrowserWindow } = require("electron");
const AppWindow = require("./app-window");
const getUuid = require("mnm-uuid");
const path = require("path");
const { fileExists } = require("../../utilities");

    
class CcScraperWindow {

    constructor(AppWindowId, componentId, windowId, preloadedScript, scraperType, resourceLocation = null)    {

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

    

}
    
module.exports = CcScraperWindow;