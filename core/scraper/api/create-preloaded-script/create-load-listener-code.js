module.exports = function(utilitiesPath) {
    
    let codeOutput = "";

    codeOutput += `window.addEventListener("load", (e) => {\n`;
    codeOutput += `\tipcRenderer.send("document-ready", {});\n`;
    codeOutput += `});\n\n`;

    return codeOutput;

}