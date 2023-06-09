module.exports = function(utilitiesPath) {
    
    let codeOutput = "";

    codeOutput += `const ccPageUtilities = require("${utilitiesPath}");\n`;
    codeOutput += `const { ipcRenderer } = require("electron");\n`;

    codeOutput += `window.ccPageUtilities = ccPageUtilities;\n`;
    codeOutput += `\n\n\n`;

    return codeOutput;

}

