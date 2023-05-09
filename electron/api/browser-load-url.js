const CcBrowserWindow = require("../classes/cc-browser-window");

module.exports = function (payload, callback = () => {}) {

    let {browserWindowId, url} = payload,
        browserWindow = CcBrowserWindow.windowObjects.find(item => item.windowId === browserWindowId);

    browserWindow.load(url);

    callback();

}