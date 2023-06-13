module.exports = function(evaluatorObject, scraperType, evaluatorIndex = 0) {
    return scraperType === "single" && typeof evaluatorIndex === "number" ? 
        {evaluator : evaluatorObject[scraperType].find((item, index) => index === evaluatorIndex), evaluatorIndex} : 
        {evaluator};
}