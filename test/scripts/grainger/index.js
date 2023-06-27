/* 

    create an array of the categorizedSets

    then replace the array item of the categorized set with the children found;

    if no children found... mark the item as isStartingPointUrl : true;

    if its children mark them with parentUrl with the parent's url;

    add additional category tags with the labels found in their url;

    then find the item in the main categorized sets and replace that with the new items;


*/

const path = require("path");
// const 
const categorizedSetScraper = require("./categorized-set-scraper");
const { createDirPath, createJsonFileObject, apiRequest, moderator } = require("../../../utilities");
const productSetsScraper = require("./product-sets-scraper");

async function categorizedSetScraping(app)  {

    app.whenReady().then(async () => {

        let jsonDirPath = await createDirPath(__dirname, "json");

        // await categorizedSetScraper(app, jsonDirPath);
        await categorizedSetScraper(app, jsonDirPath);


    });


    app.on('window-all-closed', (e) => {

        // console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSet : categorizedSet})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });

}

async function saveCategorizedSetsToDb()    {

    let jsonDirPath = await createDirPath(__dirname, "json")
        categorizedSetJson = createJsonFileObject(jsonDirPath, "categorized-set.json"),
        categorizedSet = await categorizedSetJson.getSavedData(),
        apiUrl = "http://localhost:7000/api/categorized-sets";

    await moderator(categorizedSet, async (slicedArr) => {

        let promises = slicedArr.map(item => {
            return async () => {

                let createResult = apiRequest(apiUrl, {
                    method : "POST",
                    body : JSON.stringify(item, null, 4),
                    headers : {
                        "Content-Type" : "application/json",
                    }
                }, true);

                return createResult;

            }
        });

        let createResults = await Promise.all(promises.map(item => item()));

        console.log(createResults);

    }, 20);

}

async function productSetScraping(app)  {

    // let jsonDirPath = await createDirPath(__dirname, "json", "products");

    app.whenReady().then(async () => {

        let jsonDirPath = await createDirPath(__dirname, "json");

        // await categorizedSetScraper(app, jsonDirPath);
        await productSetsScraper(app);


    });


    app.on('window-all-closed', (e) => {

        // console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSet : categorizedSet})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}   

module.exports = async function(app)    {
    
    // await categorizedSetScraping(app);

    // await saveCategorizedSetsToDb();

    await productSetScraping(app)


}
