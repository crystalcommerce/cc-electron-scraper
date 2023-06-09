const { BrowserWindow } = require("electron");

module.exports = function (payload, callback = () => {}) {

    let {screenshotWindowId} = payload,
        hiddenWindow = BrowserWindow.fromId(screenshotWindowId);

        hiddenWindow.close();

    callback();

}