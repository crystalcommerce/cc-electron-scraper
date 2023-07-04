module.exports = function(waitForSelectors) {

    let codeOutput = "";

    codeOutput += `\t\tlet waitForSelectors = [${waitForSelectors.map(item => `"${item}"`)}],\n`;
    codeOutput += `\t\t\t{AppWindowId, componentId, windowId} = window.ccScraperWindow,\n`;
    codeOutput += `\t\t\t{ waitForSelector, timedReload, slowDown, queryStringToObject, objectToQueryString } = window.ccPageUtilities,\n`;
    codeOutput += `\t\t\tpromises = waitForSelectors.map(selector => {\n`;
    codeOutput += `\t\t\t\treturn async function(){\n`;
    codeOutput += `\t\t\t\t\treturn await waitForSelector(() => document.querySelector(selector));\n`;
    codeOutput += `\t\t\t\t};\n`;
    codeOutput += `\t\t\t});\n`;
    codeOutput += `\t\tlet results = await Promise.all(promises.map(item => item()));\n`;
    codeOutput += `\n`;


    codeOutput += `\t\tlet {queryObject, urlWithoutQueryString} = queryStringToObject(window.location.href),\n`;
    codeOutput += `\t\t\tcurrentWait = Number(queryObject.cc_failed_waits) || 0;\n\n`;
    
    codeOutput += `\t\tcurrentWait++;\n`;
    codeOutput += `\t\tqueryObject.cc_failed_waits = currentWait;\n\n`;
    codeOutput += `\t\tlet newQueryString = objectToQueryString(queryObject);\n`;
    

    codeOutput += `\t\tif(results.some(result => !result)) {\n`;
    codeOutput += `\t\t\tipcRenderer.send("cc-scraping-wait-for-selectors-failed", {\n`;

    codeOutput += `\t\t\t\tpayload : {\n`;
    codeOutput += `\t\t\t\t\tAppWindowId,\n`;
    codeOutput += `\t\t\t\t\tcomponentId,\n`;
    codeOutput += `\t\t\t\t\twindowId,\n`;
    codeOutput += `\t\t\t\t\tmessage : "Waiting for html selectors failed.",\n`;
    codeOutput += `\t\t\t\t\turl : urlWithoutQueryString + "?" + newQueryString,\n`;
    codeOutput += `\t\t\t\t\tcurrentWait,\n`;
    codeOutput += `\t\t\t\t}\n`;
    codeOutput += `\t\t\t});\n\n\n`;
    codeOutput += `\t\t}\n`;




    codeOutput += "\n\n";

    return codeOutput;
}