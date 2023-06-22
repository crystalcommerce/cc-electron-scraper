const { createNodeModule, toUrl } = require("../../../../utilities");
const createCallbackCode = require("./create-callback-code");
const createIpcrendererSendResult = require("./create-ipcrenderer-send-result");
const createLoadListenerCode = require("./create-load-listener-code");
const createPageMaskCode = require("./create-page-mask-code");
const createUtilsCode = require("./create-utils-code");
const createWaitForSelectorCode = require("./create-wait-for-selector-code");
const path = require('path');

module.exports = async function({evaluator, utilitiesPath, fileName, scraperType, targetPath, serverUrl, evaluatorIndex})  {

    let {callback, waitForSelectors} = evaluator,
        codeOutput = "";

    codeOutput += createUtilsCode(utilitiesPath);

    codeOutput += createPageMaskCode(serverUrl);

    codeOutput += createLoadListenerCode();

    codeOutput += "(async function(){\n\n";


        codeOutput += `\tipcRenderer.once("scraper-window-details", async (e, data) => {\n`;


            codeOutput += "\t\tconsole.log(data);\n";


            codeOutput += "\n";
            codeOutput += "\t\tlet {ccScraperWindow, ccDataProps} = data;\n\n";
            codeOutput += "\t\twindow.ccScraperWindow = ccScraperWindow;\n";
            codeOutput += "\t\twindow.ccDataProps = ccDataProps;\n\n";

            // waitforSelectors;
            codeOutput += createWaitForSelectorCode(waitForSelectors);

            // execution of callback;
            codeOutput += createCallbackCode(callback);
            
            // sending the data back to main process;
            codeOutput += createIpcrendererSendResult();


        codeOutput += "\t});\n";

        codeOutput += "\n\n";

    codeOutput += "}());";


    // console.log(codeOutput);

    let fileNameWithExt = `${toUrl(`${[fileName, scraperType, evaluatorIndex].filter(item => item.toString().trim() !== "").join(" ")}`)}.js`,
        result = await createNodeModule(targetPath, fileNameWithExt, codeOutput);;

        console.log(result)

    return {result, preloadedScript : path.join(targetPath, fileNameWithExt)};

}