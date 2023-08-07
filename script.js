const grainger = require("./test/scripts/grainger");
const { app, ipcMain } = require('electron');
const officeDepot = require("./test/scripts/office-depot");
const sampleRequest = require("./test/scripts/sample-requests");


(async function(){

    await officeDepot(app, ipcMain);

    // await grainger(app, ipcMain);

    // await sampleRequest(app, ipcMain);

    

}());