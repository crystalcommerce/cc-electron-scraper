const CcBrowserWindow = require("../classes/cc-browser-window");

module.exports = function (e, data) {

    let browserWindow = CcBrowserWindow.windowObjects.find(item => item.windowId === data.payload.browserWindowId),
        method = data.action === "open" ? "openDevTools" : "closeDevTools";

    console.log(method);
    console.log(data.payload.action);
    if(browserWindow)   {
        browserWindow.windowObject.webContents[method]();
    }

}