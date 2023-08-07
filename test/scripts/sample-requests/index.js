const getPaginatedResultsFn = require("../../../server/controllers/api/get-paginated-results-fn");
const { createDirPath } = require("../../../utilities");

module.exports = async function(app, ipcMain)    {

    app.whenReady().then(async () => {

        async function getPreReq()  {
            let payload = {
                ccScriptData : {
                    fileName : "office-depot",
                    apiEndpoint : "office-depots",
                },
                ccScraperData : {
                    AppWindowId : null,
                    componentId : null,
                    scraperType : "single",
                },
            },
            appAbsPath = app.getAppPath(),
            userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
            serverUrl = "http://localhost:7000",
            apiUrl = `${serverUrl}/api/${payload.ccScriptData.apiEndpoint}`,
            { callback, page, pageTotal, data } = await getPaginatedResultsFn(apiUrl, {});
    
            return {
                callback, 
                page, 
                pageTotal,
                data,
                payload, 
                appAbsPath, 
                userDataPath,
                serverUrl,
                apiUrl
            }
        }
    
        let {serverUrl, apiUrl, callback} = await getPreReq(),
            arr = new Array();
    
    
        arr.length = 1000;
        arr.fill(async function(){
            let result = await callback();
            console.log(result);
        });
    
        await Promise.all(arr.map(item => item()));


        app.quit();

    });

    app.on('window-all-closed', (e) => {

        e.preventDefault();

    });

    


}