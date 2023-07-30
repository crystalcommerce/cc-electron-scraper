
const printDataToCsvBySet = require("../../../../core/scraper/api/print-data-to-csv-by-set");
const { moderator, apiRequest, createDirPath } = require("../../../../utilities");

module.exports = async function(app, ipcMain)   {
    
    let payload = {
            ccScriptData : {
                fileName : "grainger-packaging-and-shipping-supplies",
                apiEndpoint : "grainger-packaging-and-shipping-supplies",
                siteUrl : "www.grainger.com",
            },
            ccScraperData : {
                AppWindowId : null,
                componentId : null,
            },
        }
        serverUrl = "http://localhost:7000",
        apiEndpoint = payload.ccScriptData.apiEndpoint,
        downloadsPath = app.getPath("downloads"),
        // targetPath = await createDirPath(downloadsPath, "cc-scraper"),
        targetPath = `F:/My Drive/Crystal Commerce`,
        categorizedSetApiUrl = `${serverUrl}/api/categorized-sets/all?siteUrl=${encodeURIComponent(payload.ccScriptData.siteUrl)}`,
        categorizedSets = await apiRequest(categorizedSetApiUrl),
        dirPathIndex = 1;


    console.log({total : categorizedSets.length, categorizedSetApiUrl});

    console.log(categorizedSets);

    await moderator(categorizedSets, async (slicedArr) => {

        let [categorizedSet] = slicedArr,
            { siteName, setData } = categorizedSet;
            
        
        console.log({siteName, setData});


        await printDataToCsvBySet({
            apiEndpoint,
            serverUrl,
            targetPath,
            setData : {
                category : setData.category,
                subcategory : setData.subcategory,
            },
            callback : async (data) => {
                console.log(data);
            },
            dirPathIndex,
        });

        dirPathIndex++;

    }, 1);

    app.quit();

}