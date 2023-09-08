const path = require("path");
const CcScraperWindow = require('../../electron/classes/cc-scraper-window');
const { createDirPath, generateUuid, moderator, waitForCondition, readFile } = require('../../utilities');
const ProductSetScraper = require("../../core/scraper/classes/product-set-scraper");

module.exports = async function(app)    {

    let categorizedSets = [
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Backpacks",
            "setData": {
                "category": "Bags",
                "subcategory": "Backpacks"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Belt%20Bag",
            "setData": {
                "category": "Bags",
                "subcategory": "Belt Bag"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Bowler",
            "setData": {
                "category": "Bags",
                "subcategory": "Bowler"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Briefcases",
            "setData": {
                "category": "Bags",
                "subcategory": "Briefcases"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Bucket",
            "setData": {
                "category": "Bags",
                "subcategory": "Bucket"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Clutches",
            "setData": {
                "category": "Bags",
                "subcategory": "Clutches"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Cross%20Body%20Bags",
            "setData": {
                "category": "Bags",
                "subcategory": "Cross Body Bags"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Duffles",
            "setData": {
                "category": "Bags",
                "subcategory": "Duffles"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Hobos",
            "setData": {
                "category": "Bags",
                "subcategory": "Hobos"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Messenger",
            "setData": {
                "category": "Bags",
                "subcategory": "Messenger"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Rolling%20Suitcase",
            "setData": {
                "category": "Bags",
                "subcategory": "Rolling Suitcase"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Satchels",
            "setData": {
                "category": "Bags",
                "subcategory": "Satchels"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Shoulder%20Bags",
            "setData": {
                "category": "Bags",
                "subcategory": "Shoulder Bags"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Small%20Goods",
            "setData": {
                "category": "Bags",
                "subcategory": "Small Goods"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Top%20Handle",
            "setData": {
                "category": "Bags",
                "subcategory": "Top Handle"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Totes",
            "setData": {
                "category": "Bags",
                "subcategory": "Totes"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Wallets",
            "setData": {
                "category": "Bags",
                "subcategory": "Wallets"
            },
            "setId" : generateUuid(),
        },
        {
            "startingPointUrl": "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true&sort=created-descending&pf_t_bag_type=bc-filter-Waist%20Bag",
            "setData": {
                "category": "Bags",
                "subcategory": "Waist Bag"
            },
            "setId" : generateUuid(),
        }
    ];
    

    categorizedSets = categorizedSets.filter(item => item.setData.subcategory === "Bowler" || item.setData.subcategory === "Wallets"); 

    app.whenReady().then(async () => {

        let payload = {
                ccScriptData : {
                    fileName : "rebag-bags",
                },
                ccScraperData : {
                    AppWindowId : null,
                    componentId : null,
                    scraperType : "set",
                },
            },
            appAbsPath = app.getAppPath(),
            userDataPath = await createDirPath(app.getPath("appData"), "cc-electron-scraper"),
            serverUrl = "http://localhost:7000";
            
        
        await moderator(categorizedSets, async (slicedArr) => {

            let promises = slicedArr.map(categorizedSet => {
                return async () => {
                    let productSetScraper = new ProductSetScraper({
                        categorizedSet : categorizedSet, 
                        userDataPath, 
                        appAbsPath, 
                        serverUrl, 
                        payload, 
                    });
            
                    console.log(productSetScraper);
            
                    await productSetScraper.initialize();
                }
            });

            await Promise.all(promises.map(item => item()));

        }, CcScraperWindow.maxOpenedWindows);

        

    });


    app.on('window-all-closed', (e) => {

        console.log({totalOpenedWindows : CcScraperWindow.windowObjects.length, categorizedSets : categorizedSets})
        // e.preventDefault();
        // if (process.platform !== 'darwin') {
        //     app.quit()
        // }
    });
}