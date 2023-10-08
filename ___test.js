
const { app } = require('electron');
const singleProductScraping = require("./test/single-product-scraping");
const productSetScraping = require("./test/product-set-scraping");

(async function(){
    
    // single product scraping
    // await singleProductScraping(app);

    // product set scraping
    await productSetScraping(app);

    
}())