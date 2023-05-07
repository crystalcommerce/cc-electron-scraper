const puppeteer = require("puppeteer");
const { addFailedResponseHeaders, saveCurrentState } = require("./header-response");


module.exports = async function(url, evaluator, saveStateCallback = () => {})    {
    
    try {
        let browser = await puppeteer.launch({headless : false}),
            page = await browser.newPage(),
            {callback, args, waitMethods} = evaluator;
            
        await page.setViewport({height : 3000, width : 1440});
        let response = await page.goto(url, {waitUntil : "networkidle0", timeout : 0});

        

        if(waitMethods.length)  {
            for(let i = 0; i < waitMethods.length; i++)    {
                let waitMethod = waitMethods[i];
                await page[waitMethod.name](waitMethod.args);
            }
        }

        let productObjects = await page.evaluate(callback, ...args);

        addFailedResponseHeaders(response._status);
        await saveCurrentState(saveStateCallback.bind(null, productObjects));

        console.log(productObjects);

        global.requestsMade += 1;
        console.log({numberOfRequestsMade : global.requestsMade, partOfProcess : "Getting the links / variants of the main product", failedResponse : global.failedResponse});

        browser.close();
        
        return productObjects;
    } catch(err)    {
        console.log(err.message);
        return [];
    }
    
}