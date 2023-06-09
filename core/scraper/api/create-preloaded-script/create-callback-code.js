module.exports = function (callback)   {
    let codeOutput = "";

    codeOutput += `\t\tlet callback = ${callback.toString()};\n`;

    codeOutput += `\n\n`;

    codeOutput += `\t\t//executing the callback function\n`;
    codeOutput += `\t\tlet ccScrapingResult = await callback(window.ccPageUtilities, window.ccDataProps);\n`;

    codeOutput += `\n\n\n`;


    return codeOutput;
}


