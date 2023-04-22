const path = require("path");

let utilities = require("../utilities"),
    {moderator, createJsonFileObject, slowDown} = utilities;

console.log(utilities);


(async function(){


    
    let jsonFileObject = createJsonFileObject(path.join(__dirname, "test"), "product-objects.json"),
        productObjects = await jsonFileObject.getSavedData();

    productObjects = productObjects.slice(0, 50);

    console.log(jsonFileObject);

    // console.table(productObjects);

    /*

        moderator, createJsonFileObject, slowDown
    
    */

    // await moderator(productObjects, async (slicedArr) => {

    //     let promises = slicedArr.map(productObject => {
    //             return async function ()    {

    //                 await new Promise((resolve) => {

    //                     let timer = 0,
    //                         interval = setInterval(() => {

    //                             timer += (10 / 100);

    //                             console.log({time : timer});

    //                             if(timer >= 1.5)    {
    //                                 clearInterval(interval);
    //                             }

    //                         }, 100);


    //                     setTimeout(() => {
    //                         console.log({
    //                             productObject,
    //                             message : "Product has been saved to database...",
    //                             statusOk : true,
    //                         });
    //                         resolve();
    //                     }, 1500);
    //                 });

    //                 await slowDown(3434);

    //             };

    //         });

    //     await Promise.all(promises.map(item => item()));

    // }, 5);

    /* 
    
        enumerate
    
    */


    // let {enumerate} = utilities;
    //     productObject = productObjects[0];

    // let string = enumerate(Object.keys(productObject), true);

    // console.log(string);

    
    /* 

        generateUuid

    */

    // let {generateUuid} = utilities,
    //     id = generateUuid();

    // console.log(id);

    /* 
        baseName
    */

    // let {baseName} = utilities,
    //     filePath = path.join(__dirname, "test", "product-objects.json");

    // console.log({
    //     filePath,
    //     baseName : baseName(filePath),
    // });


    /*
        fileExists
    */

    // let {fileExists} = utilities,
    //     existingFile = path.join(__dirname, "test", "product-objects.json"),
    //     nonExistingFile = path.join(__dirname, "test", "product-objects.js")

    // console.log([
    //     {filePath : existingFile, doesFileExists : fileExists(existingFile)},
    //     {filePath : nonExistingFile, doesFileExists : fileExists(nonExistingFile)}
    // ]);


    /* 

        formattedDate, dateTimeObject, getTimeElapsed

    */

    // let {formattedDate, dateTimeObject, getTimeElapsed} = utilities,
    //     date = new Date(),
    //     date2 = new Date(date.getTime() - (1000 * 60 * 60 * 3)),
    //     dateTimeObject1 = dateTimeObject(date.getTime()),
    //     dateTimeObject2 = dateTimeObject(date2.getTime())

    // console.log({

    //     timeInseconds : date.getTime(),
    //     timeInseconds2 : date2.getTime(),

    //     formattedDate : formattedDate(date),

    //     currentTime : {
    //         dateTimeObject : dateTimeObject1,
    //         currentTime : dateTimeObject1.getCurrentTime(true),
    //         currentDate : dateTimeObject1.getCurrentDate(),
    //     }, 
    //     prevTime : {
    //         dateTimeObject : dateTimeObject2,
    //         currentTime : dateTimeObject2.getCurrentTime(true),
    //         currentDate : dateTimeObject2.getCurrentDate(),
    //     },

    //     timeElapsed : getTimeElapsed(date2.getTime(), date.getTime()),
    // });

    /* 
    
        getValidatedPropValues, isObjectInArray, getAllObjectKeys, sortObjectsByDate, objectToString, isObjectUnique, filterUnlistedObjects
    
    */

    // let {getRandomNumber, getValidatedPropValues, isObjectInArray, getAllObjectKeys, sortObjectsByDate, sortObjectsByPropName, objectToString, isObjectUnique, filterUnlistedObjects, shuffleArr} = utilities;


    // // getRandomNumber
    // let numbersArr = [],
    //     length = 50;

    // while(numbersArr.length < length)   {
    //     let randomNum = getRandomNumber(0, length);

        

    //     if(!numbersArr.includes(randomNum))  {

    //         console.log(randomNum);
    //         numbersArr.push(randomNum);
    //     }
    // }

    // console.log(numbersArr);
    // numbersArr.sort((a, b) => a - b);
    // console.log(numbersArr);

    // console.log(numbersArr.length);

    // // getValidatedPropValues

    // let productObject = {
    //         productName : "Sample Product",
    //         productObjectProperties : {
    //             propName : "Sample Prop Name",
    //             productTagNames : {
    //                 regular : "regular tag name",
    //                 special : "special tag name",
    //             }
    //         }
    //     },
    //     specialTagName = getValidatedPropValues(productObject, ["productObjectProperties", "productTagNames", "special"]);

    // console.log({specialTagName});

    // // isObjectInArray

    // let randomNumber  = getRandomNumber(0, productObjects.length),
    //     randomObject = productObjects[randomNumber],
    //     excludedObject = {
    //         id: 'fd836105-b008-4b80-87d8-39ce5b8951f2',
    //         skillUri: 'https://www.mymajors.com/career/Automotive-Engineers/',
    //         category: 'Architecture and Engineering Occupation ',
    //         jobTitles: 'Automotive Engineers',
    //         dateCreated: 1674167817777,
    //         unscraped: false
    //     }

    // console.log({
    //     includedObject : {
    //         productObject : randomObject, 
    //         isIncludedInArrayOfObjects : isObjectInArray(randomObject, productObjects, ["dateCreated"])
    //     },
    //     excludedObject : {
    //         productObject : excludedObject,
    //         isIncludedInArrayOfObjects : isObjectInArray(excludedObject, productObjects, ["dateCreated"])
    //     }
    // });


    // // getAllObjectKeys 

    // console.log(getAllObjectKeys(productObjects));

    
    // // sortObjectsByDate && shuffleArr

    // productObjects.forEach((item, index) => {
    //     item.dateCreated += index;
    // });

    // console.table(productObjects);

    // shuffleArr(productObjects);

    // console.table(productObjects);

    // // ascending
    // sortObjectsByDate(productObjects, "dateCreated");

    // console.table(productObjects);

    // // descending
    // sortObjectsByDate(productObjects, "dateCreated", false);

    // console.table(productObjects);
    
    
    // // sort by propName

    // // ascending

    // sortObjectsByPropName(productObjects, "jobTitles");


    // console.table(productObjects);
    // console.log({order : "Ascending", propName : "Job Title"});

    // // descending
    // sortObjectsByPropName(productObjects, "jobTitles", false);
    // console.table(productObjects);
    // console.log({order : "Descending", propName : "Job Title"});

    // // objectToString

    // console.log(objectToString(productObjects[0]));

    // productObject = {...productObjects[getRandomNumber(0, productObjects.length)]};


    // console.log(isObjectInArray(productObject, productObjects, ["jobTitles"]));
    // console.log(isObjectInArray({...productObject}, productObjects, ["jobTitles"]));

    // productObject.jobTitles = "Bakal-bote";
    // console.log(isObjectInArray(productObject, productObjects, ["jobTitles"]));


    // // isObjectUnique

    // console.log(isObjectUnique(productObject, productObjects, keys=["id", "jobTitles"])); // one of them contains the same id; // result : false;

    // console.log(isObjectUnique(productObject, productObjects, keys=["jobTitles"])); // none of them contains the same jobTitles; // result : true;


    // // filterUnlistedObject
    // console.table(filterUnlistedObjects(productObjects.filter(item => item.dateCreated % 2 === 0), productObjects, keys=["dateCreated"]));



    /* 
    
        String Utilities
    
    */

    // let {toUrl, toCapitalize, toCapitalizeAll, toNormalString, toCamelCase, } = utilities;

    // let string = "Michael Norward Miranda";

    // console.log({
    //     toUrl : toUrl(string),
    //     toCapitalize : toCapitalize(string.toLowerCase()),
    //     toCapitalizeAll : toCapitalizeAll(string.toUpperCase()),
    //     toNormalString : toNormalString(toCamelCase(string.toUpperCase())),
    //     toCamelCase : toCamelCase(string),
    // });


    /* 
    
        URL Utilities
    
    */
    // let { urlConstructor, objectToQueryString, queryStringToObject, } = utilities;

    // let url = urlConstructor("google.com");

    // console.log(url);

    // url = `${url}/sample-path/sub-path?firstName=${encodeURIComponent("Michael Norward")}&lastName=${encodeURIComponent("Miranda")}&age=${encodeURIComponent(34)}`;

    // let queryObject = queryStringToObject(url);

    // console.log(queryObject);

    // let queryString = objectToQueryString(queryObject.queryObject);

    // console.log(queryString);
    // console.log(queryString === queryObject.queryString);

    /* 
    
        WebPage Utilities
    
    */



    /* 
    
        WebRequest Utilities
    
    */
    let {apiRequest, verifyUrl, postDataObjects} = utilities;


    let result = await verifyUrl("http://localhost:8181", false);

    console.log(result);

    result = await verifyUrl("https://api.scryfall.com/cards/search?q=c%3Awhite+mv%3D1", false);

    console.log(result);


    result = await verifyUrl("https://192.168.86.34:8080", false);

    console.log(result);




    let users = new Array(30),
        obj = {username : "mmichaelnorward777", password : "01Correct"};
    users.fill(Object.assign(new Object(), obj));

    

    let authUrl = "https://192.168.86.34:8080/auth/login",
        postResult = await apiRequest(authUrl, {method : "POST", body : JSON.stringify(obj, null, 4)});
    
        console.log(postResult);


    console.log(users);

    users = users.map((item, i) => {
        item.password = i % 2 === 0 ? utilities.generateUuid() : "01Correct";
        return {...item};
    });

    console.table(users);


    let authResults = await postDataObjects(authUrl, users, async (results) => {

        await slowDown(10000);
        console.log(results);

    });


    console.log(authResults);
    

}());



/*

    In this module we have tested all the utilites except for the file-system and the web-page utilities;


*/