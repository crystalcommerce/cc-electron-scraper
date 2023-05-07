const puppeteer = require("puppeteer");
const { addFailedResponseHeaders, saveCurrentState } = require("./header-response");

module.exports = async function(url, evaluator, saveStateCallback = () => {}, iterationLimit = null)    {
    try    {
        let browser = await puppeteer.launch({headless : false}),
            page = await browser.newPage(),
            { callback, args, waitMethods } = evaluator,
            allProductObjects = [],
            iteration = 0;


        async function getProductObjects(page, url, allProductObjects) {
            
            await page.setViewport({height : 900, width : 1440});
            let response = await page.goto(url, {waitUntil : "networkidle0", timeout : 0});

            addFailedResponseHeaders(response._status);
            await saveCurrentState(saveStateCallback.bind(null, allProductObjects));

            if(waitMethods.length)  {
                for(let waitMethod of waitMethods)    {
                    await page[waitMethod.name](waitMethod.args);
                }
            }


            let { productObjects, newUrl } = await page.evaluate(callback, url, ...args);
            
            console.log({
                productObjects, newUrl
            });
            allProductObjects.push(...productObjects);
            
            global.requestsMade += 1;
            console.log({numberOfRequestsMade : global.requestsMade, partOfProcess : "Getting links of product variants", failedResponse : global.failedResponse});
            
            if(newUrl && (typeof iterationLimit !== "number" || iteration < iterationLimit))  {
                iteration += 1;
                await getProductObjects(page, newUrl, allProductObjects);
            }



            
        }
        
        await getProductObjects(page, url, allProductObjects);

        browser.close();

        return allProductObjects;
    } catch(err)    {
        console.log(err.message);
    }
    

}