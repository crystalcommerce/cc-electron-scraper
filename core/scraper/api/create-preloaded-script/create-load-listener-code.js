module.exports = function(utilitiesPath) {
    
    let codeOutput = "";

    codeOutput += `window.addEventListener("load", (e) => {\n`;
    codeOutput += `\tsetTimeout(() => {\n`;
    codeOutput += `\t\tipcRenderer.send("document-ready", {});\n`;
    codeOutput += `\t}, 3000)\n`;
    codeOutput += `});\n\n`;

    return codeOutput;

}