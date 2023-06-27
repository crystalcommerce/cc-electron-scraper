/* 

    create an array of the categorizedSets

    then replace the array item of the categorized set with the children found;

    if no children found... mark the item as isStartingPointUrl : true;

    if its children mark them with parentUrl with the parent's url;

    add additional category tags with the labels found in their url;

    then find the item in the main categorized sets and replace that with the new items;


*/

const path = require("path");
const CcScraperWindow = require('../../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile, createJsonFileObject, isObjectInArray } = require('../../../utilities');
const ProductSetScraper = require("../../../core/scraper/classes/product-set-scraper");

const categorizedSet = require("./categorized-set");
const evaluatePage = require("../../../electron/api/scraper-window/evaluate-page");
// const createScraperWindow = require("../../../electron/api/scraper-window/create-scraper-window");
let categorizedSetSlice = categorizedSet.slice();

function replaceCategoryObject(categoryObject, categorizedSetsArr, newCategorizedSet) {

    if(!newCategorizedSet.length)    {

        categoryObject.isStartingPoint = true;

        categorizedSetsArr.push(categoryObject);

    } else  {

        categorizedSetsArr = categorizedSetsArr.filter(item => item.startingPointUrl !== categoryObject.startingPointUrl);

        for(let object of newCategorizedSet)    {
            console.log({isObjectInArray : isObjectInArray(object, categorizedSetsArr, ["startingPointUrl"])});
            if(!isObjectInArray(object, categorizedSetsArr, ["startingPointUrl"]))   {
                categorizedSetsArr.push(object);
            }
        }
        
    }

    return categorizedSetsArr;
    
}

function createScraperWindow()    {
    let ccScraperWindow = new CcScraperWindow({
        AppWindowId : null, 
        componentId : null, 
        windowId : null, 
        preloadedScript : path.join(__dirname, "preloaded-script.js"), 
        scraperType : "categorized-set", 
        resourceLocation : null,
    });

    ccScraperWindow.initialize();

    return ccScraperWindow;
}

async function getStartingPointUrls(categorizedSet)   {

    let categorizedSetsArr = categorizedSet.filter(item => item.isStartingPoint);

    await moderator(categorizedSet.filter(item => !item.isStartingPoint), async(slicedArr) => {

        let promises = slicedArr.map(categoryObject => {
            return async () => {
                let ccScraperWindow = createScraperWindow();

                // console.log(ccScraperWindow);

                console.log();

                ccScraperWindow.showWindow();

                let dataObject = await evaluatePage({
                    ccScraperWindow,
                    resourceUri : categoryObject.startingPointUrl,
                    dataObject : {categoryObject},
                    uriPropName : "startingPointUrl",
                    closeOnEnd : true,
                });

                let {newCategorizedSet} = dataObject;

                // console.log(categorizedSetSlice);
                
                // replaceCategoryObject(categoryObject, categorizedSetSlice, newCategorizedSet);

                categorizedSetsArr = replaceCategoryObject(categoryObject, categorizedSetsArr, newCategorizedSet);
                
            }
        });
            
        await Promise.all(promises.map(item => item()));
            // console.log(categorizedSetSlice);
    }, 5);

    let filteredArr = categorizedSetsArr.filter(item => !item.isStartingPoint),
        finishedArr = categorizedSetsArr.filter(item => item.isStartingPoint);

    console.log(`\n\n\n\n`);
    console.log({filteredArrTotal : filteredArr.length, finishedArrTotal : finishedArr.length,  categorizedSetsArr});

        let categorizedSetJsonFileSample = createJsonFileObject(path.join(__dirname, "json"), "categorized-set-sample.json");

        await categorizedSetJsonFileSample.addNewData(categorizedSetsArr);

    if(filteredArr.length)  {
        await getStartingPointUrls(categorizedSetsArr);
    }   else    {
        let categorizedSetJsonFile = createJsonFileObject(path.join(__dirname, "json"), "categorized-set.json");

        await categorizedSetJsonFile.addNewData(categorizedSetsArr);
    }
    

}



module.exports = async function(app)    {
    app.whenReady().then(async () => {

        await getStartingPointUrls(categorizedSet);

    });


    app.on('window-all-closed', (e) => {

        // console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSet : categorizedSet})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}
