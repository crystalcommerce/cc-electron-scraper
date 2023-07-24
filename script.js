const grainger = require("./test/scripts/grainger");
const { app, ipcMain } = require('electron');
const officeDepot = require("./test/scripts/office-depot");


(async function(){

    // await officeDepot(app, ipcMain);

    await grainger(app, ipcMain);

}());