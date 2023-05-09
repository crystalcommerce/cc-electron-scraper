const {ipcRenderer} = require("electron");

module.exports = function(browserWindowId, action, data) {

    ipcRenderer.send("scraper-window-data", {
        browserWindowId,
        action,
        payload : data
    });

}