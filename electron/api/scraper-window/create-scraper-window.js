const CcScraperWindow = require("../../classes/cc-scraper-window");
const getPreloadedScript = require("../../../core/scraper/api/get-preloaded-script");

module.exports = async function(payload, userDataPath, appAbsPath, serverUrl, appObject)  {

    if(!appObject.ready)    {
        throw Error("Application is getting reloaded.");
    }

    try {

        let { ccScriptData, ccScraperData } = payload,
            { AppWindowId, componentId, windowId, scraperType } = ccScraperData,
            { fileName } = ccScriptData,
            resourceLocation = null,
            { preloadedScript, evaluator } = await getPreloadedScript(appAbsPath, userDataPath, fileName, scraperType, serverUrl),
            ccScraperWindow = new CcScraperWindow({AppWindowId, componentId, windowId, preloadedScript, scraperType, resourceLocation});

        ccScraperWindow.initialize();

        return { ccScraperWindow, evaluator };
    
    } catch(err)    {

        console.log(err);

        return null;

    }

}