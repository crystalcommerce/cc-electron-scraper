module.exports = function(waitForSelectors) {

    let codeOutput = "";

    codeOutput += `\t\tlet waitForSelectors = [${waitForSelectors.map(item => `"${item}"`)}],\n`;
    codeOutput += `\t\t\t{ awaitSelector, timedReload } = window.ccPageUtilities,\n`;
    codeOutput += `\t\t\tpromises = waitForSelectors.map(selector => {\n`;
    codeOutput += `\t\t\t\treturn async function(){\n`;
    codeOutput += `\t\t\t\t\tawait timedReload(() => document.querySelector(selector));\n`;
    codeOutput += `\t\t\t\t};\n`;
    codeOutput += `\t\t\t});\n`;
    codeOutput += `\t\tawait Promise.all(promises.map(item => item()));\n`;

    codeOutput += "\n\n";

    return codeOutput;
}