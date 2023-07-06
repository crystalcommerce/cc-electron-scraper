module.exports = function (callback)   {
    let codeOutput = "";

    codeOutput += `\t\tlet callback = ${callback.toString()};\n`;

    codeOutput += `\n\n`;

    codeOutput += `\t\t//executing the callback function\n`;
    codeOutput += `\t\tlet ccScrapingResult = await callback(window.ccPageUtilities, window.ccDataProps);\n`;

    codeOutput += `\t\tlet innerHTML = "<h2 style='font-size : 1.2rem; color : white;'>Scraped Data</h2>";\n`;

    codeOutput += `\t\tinnerHTML += "<ul style='font-family : monospace; text-align : left; padding : 1.5rem'>";\n`;

    codeOutput += `\t\tfor(let key in ccScrapingResult){\n`;

    codeOutput += `\t\t\tlet value = function(){\n`;
    codeOutput += `\t\t\t\tlet val = ccScrapingResult[key];\n`;
    codeOutput += `\t\t\t\tif(typeof val !== "string")	{\n`;
    codeOutput += `\t\t\t\t\treturn JSON.stringify(val, null, 4);\n`;
    codeOutput += `\t\t\t\t}\n`;
    codeOutput += `\t\t\t}();\n\n`;
    codeOutput += `\t\t\tinnerHTML += "<li><span style='color : #b4ff00; font-weight : bold;'>" + key + "</span> : <span style='color : white'>" + ccScrapingResult[key] + "</span></li>";\n`;

    codeOutput += `\t\t}\n`;

    codeOutput += `\t\tinnerHTML += "</ul>";\n`;
    codeOutput += `\t\tmodalContainerBody.innerHTML += innerHTML;\n`;

    codeOutput += `\n\n\n`;


    return codeOutput;
}


