module.exports = function() {

    let codeOutput = "";

    codeOutput += "\t\t// sending the data back to main process;\n";

    codeOutput += `\t\tawait slowDown(2525);\n`;
    codeOutput += `\t\tipcRenderer.send("cc-scraping-result", {\n`;

    codeOutput += `\t\t\tpayload : {\n`;
    codeOutput += `\t\t\t\tAppWindowId,\n`;
    codeOutput += `\t\t\t\tcomponentId,\n`;
    codeOutput += `\t\t\t\twindowId,\n`;
    codeOutput += `\t\t\t\tccScrapingResult,\n`;
    codeOutput += `\t\t\t}\n`;
    codeOutput += `\t\t});\n\n\n`;

    return codeOutput;

}
