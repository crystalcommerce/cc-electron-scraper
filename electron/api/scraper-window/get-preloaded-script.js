const path = require("path");
const createPreloadedScript = require("../../../core/scraper/api/create-preloaded-script");

module.exports = async function(appAbsPath, userDataPath, fileName, scraperType, serverUrl/* single, set, categorizedSets */)   {
    try {

        let scriptsPath = path.join(userDataPath, "modules", "scripts"),
            targetPath = path.join(userDataPath, "modules", "temp"),
            evaluatorObject = require(path.join(scriptsPath, `${fileName}.js`)),
            evaluator = evaluatorObject[scraperType];


        let resultObject = await createPreloadedScript({
            utilitiesPath : path.join(appAbsPath, "utilities").replace(/\\/g,"/"),
            evaluator,
            fileName,
            scraperType,
            targetPath,
            serverUrl,
        });

        let {result, preloadedScript} = resultObject;

        if(!result.status)  {
            throw Error(result.reason);
        }

        return preloadedScript;

    } catch(err)    {
        console.log(err);

        return null;
    }
}
