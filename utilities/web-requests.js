const fetch = require('node-fetch');
const http = require("http");
const https = require("https");
const axios = require("axios");
const { getValidatedPropValues } = require("./objects-array");
const { moderator } = require('./general');


async function apiRequest(url, options = {}, jsonData = true, httpsConnection = false)   {

    const httpAgent = new http.Agent({
        rejectUnauthorized: false
    });

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false
    });

    let selectedAgent = httpsConnection ? httpsAgent : httpAgent;

    let headers = {
            "Content-Type" : "application/json",
        };

    if(options.headers) {
        Object.assign(headers, options.headers);
    }

    let requestOptions = jsonData ? {...options, headers, agent : selectedAgent} : options,
        res = await fetch(url, requestOptions),
        data = await res.json();

    return data;

}

async function postDataObjects(url, dataObjects, options = {}, limit = 5, callback = async() => {}, jsonData = true, httpsConnection = false)   {
    
    let allResults = [];

    await moderator(dataObjects, async (slicedArr) => {

        let requestPromises = slicedArr.map(item => {
            return async function() {
                try {
                    let postResult = await apiRequest(
                        url, 
                        {
                            method : "POST",
                            body : JSON.stringify(item, null, 4),
                            ...options
                        },
                        jsonData,
                        httpsConnection,
                    );
                    console.log(postResult);
                    return postResult;
                } catch(err)    {
                    return item;
                }
            }
        });
    
        let results = await Promise.all(requestPromises.map(item => item()));

        await callback(results);

        allResults.push(...results);

    }, limit);

    return allResults;

}

async function verifyUrl(newUrl, sameOriginUrl = null)  {

    try {

        const httpAgent = new http.Agent({
            rejectUnauthorized: false
        });
    
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });

        // verify url;
        // if there's an axios error while doing the fetch; we'll catch that and return null url;
        let response = await axios(newUrl, { httpsAgent, httpAgent }),
            responseURL = getValidatedPropValues(response, ["request", "res", "responseUrl"]);

        

        // verify url of same origin;
        if(sameOriginUrl)   {
            let newUrlObj = new URL(responseURL),
                sameOriginUrlObj = new URL(sameOriginUrl);

            if(newUrlObj.origin !== sameOriginUrlObj.origin)  {
                throw Error("URL are not from the same origin")
            }
        }

        if(!responseURL)    {
            throw Error("We didn't get a response from that url");
        }

        return {
            statusOk : responseURL === newUrl || responseURL === `${newUrl}/`,
            url : responseURL,
        };

    } catch(err)    {

        return {
            statusOk : false,
            message : err.message,
            url : null,
        };

    }

}

module.exports = {

    apiRequest,
    postDataObjects,
    verifyUrl

}