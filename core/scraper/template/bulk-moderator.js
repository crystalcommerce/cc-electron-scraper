module.exports = async function(arr, callback, bulkCount = 5) {

    let firstIndex = 0,
        lastIndex = bulkCount;
    
    async function execute(...args)   {

        let i = 0;

        while(i < arr.length)   {

            let slicedArr = arr.slice(firstIndex, lastIndex);
            
            
            await callback(slicedArr, ...args);

            if(i + bulkCount < arr.length)  {
                i += bulkCount;
                firstIndex = i;
                lastIndex = i + bulkCount;
            } else {
                i += arr.length - i;
                firstIndex = i;
                lastIndex = arr.length;
            }

            console.log(firstIndex, lastIndex);

        }

    }

    await execute();
    
    
}