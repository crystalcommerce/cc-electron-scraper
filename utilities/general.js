function generateUuid(){
    let dt = new Date().getTime();
        
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
}

async function waitForCondition({conditionCallback, onTrueCallback, messageCallback})   {
    conditionCallback = conditionCallback ? conditionCallback : () => true;
    messageCallback = messageCallback ? messageCallback : () => {};
    onTrueCallback = onTrueCallback ? onTrueCallback : () => {};
    await new Promise(resolve => {
        messageCallback();
        let i = 0,
            interval = setInterval(() => {
                if(conditionCallback())    {
                    onTrueCallback();
                    clearInterval(interval);
                    resolve();
                }
                if(i === 100)   {
                    messageCallback();
                    i = 0;
                }
                i++;
            }, 100);
    });
}

async function moderator(arr, callback, bulkCount = 5) {

    let firstIndex = 0,
        lastIndex = bulkCount;
    
    async function execute(...args)   {

        let i = 0;

        while(i < arr.length)   {

            let slicedArr = arr.slice(firstIndex, lastIndex);
            
            
            await callback(slicedArr, firstIndex, lastIndex);

            if(i + bulkCount < arr.length)  {
                i += bulkCount;
                firstIndex = i;
                lastIndex = i + bulkCount;
            } else {
                i += arr.length - i;
                firstIndex = i;
                lastIndex = arr.length;
            }

        }

    }

    await execute();
}

async function slowDown(timeDelay = false)  {
    let delay = timeDelay ? timeDelay : 7747;
    await new Promise(resolve => setTimeout(resolve, delay));
}

function enumerate(arr, and = false)  {
    arr = [...arr];
    if(arr.length > 1)  {
        let lastIndex = arr.pop();
        return `${arr.join(", ")}, ${and ? "and" : "or"} ${lastIndex}`;  
    } else  {
        return arr[0];
    }
}

function getRandomNumber(initialIndex = 0, limit = 10)  {
    return Math.floor(Math.random() * limit) + initialIndex;
}




module.exports = {
    moderator,
    slowDown,
    enumerate,
    generateUuid,
    waitForCondition,
    getRandomNumber
}