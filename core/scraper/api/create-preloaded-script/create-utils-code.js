module.exports = function(utilitiesPath) {
    
    let codeOutput = "";

    // native node modules
    codeOutput += `const fs = require("fs");\n`;
    codeOutput += `const path = require("path");\n`;
    codeOutput += `const { fork } = require('child_process');\n`;
    codeOutput += `const http = require("http");\n`;
    codeOutput += `const https = require("https");\n`;

    // additional dependencies
    codeOutput += `const { saveAs } = window.require("file-saver");\n`;
    codeOutput += `const axios = window.require("axios");\n`;
    codeOutput += `const fetch = window.require('node-fetch');\n`;
    codeOutput += `const { ipcRenderer } = window.require("electron");\n`;
    codeOutput += `const getCcPageUtilities = window.require("${utilitiesPath}");\n`;

    // dependency injection and usage
    codeOutput += `const ccPageUtilities = getCcPageUtilities({fs, path, fork, saveAs, axios, fetch, http, https});\n`;
    
    codeOutput += `window.ccPageUtilities = ccPageUtilities;\n`;
    codeOutput += `\n\n\n`;

    return codeOutput;

}

