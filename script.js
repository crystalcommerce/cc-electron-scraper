const grainger = require("./test/scripts/grainger");
const { app, ipcMain } = require('electron');


(async function(){
    await grainger(app, ipcMain);
}())