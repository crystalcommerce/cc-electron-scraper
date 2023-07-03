const {saveAs} = require("file-saver");
const axios = require("axios");
const { moderator, slowDown, waitForCondition } = require("./general");
const { getAllObjectKeys } = require("./objects-array");

async function scrollToBottom(num = 75, containingEl = null)  {

    let scrollableHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) - window.innerHeight,
        currentScroll = window.scrollY;

    function scroll()   {
        currentScroll = window.scrollY;
    }

    window.addEventListener("scroll", scroll);

    await new Promise(resolve => {
        let interval = setInterval(() => {
                window.scrollTo(0, currentScroll + 10);

                if(currentScroll >= scrollableHeight - num) {
                    clearInterval(interval);
                    window.removeEventListener("scroll", scroll);
                    resolve();
                }
            }, 7);
    });
    
}

async function scrollToElement(el)  {
    let scrollableHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) - window.innerHeight,
        currentScroll = window.scrollY;

    function scroll()   {
        currentScroll = window.scrollY;
    }

    window.addEventListener("scroll", scroll);

    await new Promise(resolve => {
        let interval = setInterval(() => {
                window.scrollTo(0, currentScroll + 10);
                parallaxOffsetTop = el.offsetTop + el.offsetHeight;

                if(currentScroll >= parallaxOffsetTop) {

                    clearInterval(interval);
                    window.removeEventListener("scroll", scroll);
                    resolve();
                }
            }, 7);
    });

}

async function toggleScroll()   {

    let scrollableHeight = Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight
        ) - window.innerHeight,
        currentScroll = window.scrollY,
        halfPageScroll = scrollableHeight / 2;

    if(halfPageScroll > currentScroll)  {
        await scrollToBottom();
    } else  {
        await scrollToTop();
    }

    await toggleScroll();
}

async function scrollToTop()   {
    let totalHeight = document.body.offsetHeight - window.innerHeight,
        currentScroll = window.scrollY;

    function scroll()   {
        currentScroll = window.scrollY;
    }
    
    window.addEventListener("scroll", scroll);

    await new Promise(resolve => {
        let interval = setInterval(() => {
            window.scrollTo(0, currentScroll - 10);
            
            if(currentScroll <= 0) {

                clearInterval(interval);
                window.removeEventListener("scroll", scroll);
                resolve();
            }
        }, 7);
    });
}

async function waitForSelector(callback, numberOfWaits = 300)  {
    let node = callback();
    await new Promise(resolve => {
        if(node)    {
            resolve();
        }
        let i = 0,
            interval = setInterval(() => {
                node = callback();
                if(node || i >= numberOfWaits)    {
                    clearInterval(interval);
                    resolve();
                }
                i++;
            }, 100);

    });
    return node;
}

async function typeIt({el, string, elPropKey, newText, duration}) {

    elPropKey = elPropKey ? elPropKey : "value";
    newText = typeof newText !== "undefined" ? newText : true;
    duration = duration ? duration : 7;


    let charsArr = string.split(""),
        condition = el[elPropKey] === string;

    if(newText) {
        el[elPropKey] = "";
    }

    await moderator(charsArr, async (slicedArr) => {
        
        let [char] = slicedArr;

        await slowDown(duration);

        el[elPropKey] = `${el[elPropKey]}${char}`;

    }, 1);

    await waitForCondition({
        conditionCallback : () => condition,
    });

    return condition;

}

function createJSONBlob(productObjects, excludedProps = [])    {
    let allKeys = getAllObjectKeys(productObjects).filter(item => !excludedProps.includes(item)),
        data = productObjects.map(item => {
            return allKeys.reduce((a, b) => {
                a[b] = item[b];
                return a;
            }, {});
        }),
        jsonBlob = new Blob([JSON.stringify(data, null, 4)], {type: 'application/json'});

    return {jsonBlob, data : JSON.stringify(data, null, 4)};
}

async function downloadJsonFile(productObjects, productProps = {})  {
    let {jsonBlob} = createJSONBlob(productObjects),
        blobURL = URL.createObjectURL(jsonBlob),
        a = document.createElement('a'),
        fileName = `${toUrl(Object.keys(productProps).reduce((a, b) => {
            a += productProps[b] + " ";
            return a;
        }, "") + ` __date-${Date.now()}` + ` __total-${productObjects.length}`)}.json`;

    a.setAttribute('href', blobURL);
    a.setAttribute('download', `${fileName}.json`);
    
    a.style.display = 'none';
    document.body.appendChild(a);
    
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(blobURL);    
}

async function downloadAllJsonFiles(dbInstances = [], dataRowProps = {})   {

    await moderator(dbInstances, async (slicedArr) => {

        let [dbInstance] = slicedArr, 
            dataRows = await dbInstance.getAll();

        await downloadJsonFile(dataRows, dataRowProps);

    }, 1);

}

function downloadCsvData(productObjects, fileName)   {

    let {csvBlob} = createCsvBlob(productObjects),
        blobURL = URL.createObjectURL(csvBlob),
        a = document.createElement('a');

    a.setAttribute('href', blobURL);
    a.setAttribute('download', `${fileName}.csv`);
    
    a.style.display = 'none';
    document.body.appendChild(a);
    
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(blobURL);    

}

async function readBlobData(blob)   {
    let reader = new FileReader(),
        base64data = null;
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        base64data = reader.result;                
    }

    await new Promise(resolve => {
        let interval = setInterval(() => {
            if(base64data)  {
                clearInterval(interval);
                resolve();
            }
        }, 10);
    });

    return base64data;

}

async function zipData({JsZip, setData, productObjects, imageNameObject, imagePropName, csvExcludedProps, includeJson}, eventCallbacks = null, zipCallback = null)  {

    if(!csvExcludedProps)    {
        csvExcludedProps = [];
    }

    if(!zipCallback)    {
        zipCallback = {
            eventStart : async () => {},
            eventEnd : async () => {},
        }
    }

    if(!eventCallbacks) {
        eventCallbacks = {
            eventStart : async () => {},
            eventOngoing : async () => {},
            eventEnd : async () => {},
        }
    }

    csvExcludedProps = [...csvExcludedProps, "dateCreated", "_id", "__v", "imagePaths", "imageUris", "multiFaced", "productUri", "setData", "setId", "id"];

    let zip = new JsZip(),
        // Generate a directory within the Zip file structure
        img = zip.folder("images"),
        csvFileName = `${toUrl([Object.values(setData).join(" "), "dt" ,formattedDate(), "total", productObjects.length].join(" "))}.csv`,
        zipFolderName = `${toUrl([Object.values(setData).join(" "), "dt" ,formattedDate(), "total", productObjects.length].join(" "))}.zip`,
        loopIndex = 0,
        maxDownload = 20;

    await moderator(productObjects, async (slicedArr) => {

        let promises = slicedArr.map((productObject, i) => {
        
            return async function() {           

                let index = i + loopIndex,
                    nameObjects = getImageNameObject({productObject, imageNameObject, preferredExt : "jpg",  i : index}),
                    imageNames = [],
                    promisesInner = nameObjects.map(item => {
                        return async function(){

                            let {imageUri, fileName} = item,
                                eventObject = await eventCallbacks.eventStart({imageUri, index, fileName}),
                                { assignedEventId } = eventObject;
                            
                            try {

                                let res = await axios.get(imageUri, {
                                        responseType: 'arraybuffer'
                                    }),
                                    rawContent = res.data;

                                await eventCallbacks.eventOngoing({imageUri, index, fileName}, assignedEventId);

                                imageNames.push(fileName);

                                img.file(fileName, rawContent, {binary : true});

                                await eventCallbacks.eventEnd({imageUri, index, fileName}, assignedEventId);

                            } catch(err)    {
                                await eventCallbacks.eventEnd({imageUri, index, fileName, statusOk : false, message : "error occurred while downloading the image..."}, assignedEventId);
                                imageNames.push("NO IMAGE DOWNLOADED");

                            }

                        }
                    });

                await Promise.all(promisesInner.map(item => item()));
                
                productObject[imagePropName] = imageNames.join(" // ");

            }

        });

        await Promise.all(promises.map(item => item()));

        loopIndex += maxDownload;

    }, maxDownload);


    if(includeJson) {
        let jsonFileName = `${toUrl([Object.values(setData).join(" "), "dt" ,formattedDate(), "total", productObjects.length].join(" "))}.json`,
            { data : formattedData } = createJSONBlob(productObjects, csvExcludedProps);
        zip.file(jsonFileName, formattedData);
    }
    
    // Add an top-level, arbitrary text file with contents
    // zip.file(zipFolderName, "Hello World\n");
    let { data } = createCsvBlob(productObjects, csvExcludedProps);
    zip.file(csvFileName, data);

    // Generate the zip file asynchronously
    // let content = await zip.generateAsync({type:"blob"})
    // saveAs(content, zipFolderName);
    let done = false,
        zippedEventId = null;
    zip.generateAsync({type:"blob"})
        .then(async function(content) {
            // Force down of the Zip file
            let eventObject = await zipCallback.eventStart();

            zippedEventId = eventObject.assignedEventId;
            saveAs(content, zipFolderName);

            done = true;
        });


    await new Promise(resolve => {
        let interval = setInterval(() => {
            if(done && zippedEventId)  {
                clearInterval(interval);
                resolve();
            }
        }, 10);
    });


    zipCallback.eventEnd(zippedEventId);

    return true;

}

async function timedReload(condition = () => {}, timeLimit = 30)   {

    await new Promise((resolve) => {

        let timer = 0,
            interval = setInterval(() => {

            if(condition() || timer >= timeLimit) {
                clearInterval(interval);
                resolve();
            }

            timer += .5;

        }, 500);

    });

    window.location.reload();

}

module.exports = {
    scrollToBottom,
    scrollToElement,
    scrollToTop,
    toggleScroll,
    waitForSelector,
    typeIt,
    createJSONBlob,
    downloadJsonFile,
    downloadAllJsonFiles,
    downloadCsvData,
    readBlobData,
    zipData,
    timedReload,
}