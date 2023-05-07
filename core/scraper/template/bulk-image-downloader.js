const { createDirPath, toUrl } = require("../../../utilities");

module.exports = async function({dirPath, allProducts, downloadImageFn, imagePropName, imageNameObject, callback, preferedFileExt, bulkCount, i})   {

    callback = callback ? callback : async (downloadResult) => {
        await new Promise(resolve => setTimeout(resolve, 500));
    };
    i = 0;
    bulkCount = bulkCount ? bulkCount : 70;


    let imageDirPath = await createDirPath(dirPath, toUrl("images"));

    async function downloadByBulk(dirPath, allProducts, bulkCount, i) {
        let promises = [],
            counter = bulkCount + i < allProducts.length ? bulkCount + i : allProducts.length;
        
        while(i < counter)  {
            
            promises.push(await downloadImageFn.bind(null, allProducts[i], imageDirPath, imagePropName, imageNameObject, callback, preferedFileExt, i));

            i++;
        }

        await Promise.all(promises.map(item => item()));
        await new Promise(async resolve => setTimeout(resolve, 3434));

        if(i < allProducts.length)    {
            await downloadByBulk(dirPath, allProducts, bulkCount, i);
        }
    }
    

    await downloadByBulk(dirPath, allProducts, bulkCount, i);
    
}