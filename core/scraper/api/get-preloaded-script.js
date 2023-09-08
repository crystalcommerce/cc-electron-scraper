const path = require("path");
const createPreloadedScript = require("./create-preloaded-script");
const getEvaluator = require("./get-evaluator");

module.exports = async function(userDataPath, fileName, scraperType, serverUrl, evaluatorItemIndex = 0)   {
    try {

        let scriptsPath = path.join(userDataPath, "modules", "scripts"),
            targetPath = path.join(userDataPath, "modules", "temp"),
            utilitiesPath = path.join(userDataPath, "modules", "utilities").toString().replace(/\\/g, "/"),
            evaluatorObject = require(path.join(scriptsPath, `${fileName}.js`)),
            { evaluator, evaluatorIndex } = getEvaluator(evaluatorObject, scraperType, evaluatorItemIndex);

        // TODO: utilitiesPath must be changed... this may need to be changed when the app gets compiled...
        // TODO: create a different way of writing modules, so it can be easily manageable... instead of writing strings... write them as modules in js. not to be required... but to be read and executed.
        let resultObject = await createPreloadedScript({
            utilitiesPath,
            evaluator,
            fileName,
            scraperType,
            targetPath,
            serverUrl,
            evaluatorIndex
        });

        let { result, preloadedScript, fileNameWithExt } = resultObject;

        if(!result.status)  {
            throw Error(result.reason);
        }

        return { preloadedScript, evaluator, fileNameWithExt };

    } catch(err)    {
        console.log(err);

        return null;
    }
}
