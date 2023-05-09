const CcBrowserWindow = require("../classes/cc-browser-window");

module.exports = function (payload, callback = () => {}) {

    let {browserWindowId} = payload,
        browserWindow = CcBrowserWindow.windowObjects.find(item => item.windowId === browserWindowId);

    CcBrowserWindow.hideAllBrowserWindows(browserWindow.parentWindowId);
    CcBrowserWindow.verifyHiddenBrowsers(browserWindow.parentWindowId, () => {

        browserWindow.setWindowDimensions();

        browserWindow.showWindow();

        callback(); // will be used to send data to the rendrer...

    });

}