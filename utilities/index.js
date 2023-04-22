const nodeUtilities = require("./node");
const generalUtilities = require("./general");
const dateUtilities = require("./date");
const objectsArrayUtilities = require("./objects-array");
const stringUtilities = require("./string");
const urlUtilities = require("./url");
const webPageUtilities = require("./web-page");
const webRequestsUtilities = require("./web-requests");
const fileSystemUtilities = require("./file-system");
const createJsonFileObject = require("./json");


module.exports = {
    ...nodeUtilities,
    ...generalUtilities,
    createJsonFileObject,
    ...fileSystemUtilities,
    ...dateUtilities,
    ...objectsArrayUtilities,
    ...stringUtilities,
    ...urlUtilities,
    ...webPageUtilities,
    ...webRequestsUtilities,
}