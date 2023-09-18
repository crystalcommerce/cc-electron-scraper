/* 

    create an array of the categorizedSets

    then replace the array item of the categorized set with the children found;

    if no children found... mark the item as isStartingPointUrl : true;

    if its children mark them with parentUrl with the parent's url;

    add additional category tags with the labels found in their url;

    then find the item in the main categorized sets and replace that with the new items;


*/


const { createDirPath, apiRequest } = require('../../../../utilities');
const CategorizedSetsScraper = require("../../../../core/scraper/classes/categorized-sets-scraper");

// const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");


async function getPreReq(app, setId)    {
    let serverUrl = "http://localhost:7000",
        apiUrl = `${serverUrl}/api/modules/scripts/${setId}`,
        ccScriptData = await apiRequest(apiUrl),
        payload = {
            ccScriptData,
            ccScraperData : {
                AppWindowId : null,
                componentId : null,
                scraperType : "categorizedSets",
            },
        },
        appAbsPath = app.getAppPath(),
        userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper");

    return {
        payload,
        appAbsPath,
        userDataPath,
        serverUrl,
    }
}



module.exports = async function(app, ipcMain)    {
    app.whenReady().then(async () => {

        let {
                payload,
                appAbsPath,
                userDataPath,
                serverUrl,
            } = await getPreReq(app, "649b029d3ec20ad6492b43a8"),
            categorizedSetScraper = new CategorizedSetsScraper({
                userDataPath,
                serverUrl,
                payload,
            });
        
        await categorizedSetScraper.initialize();

        app.quit();
        
    });

    

    app.on('window-all-closed', (e) => {

        // console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSet : categorizedSet})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}
