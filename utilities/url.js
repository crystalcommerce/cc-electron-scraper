function urlConstructor(urlString) {
    // Step 1: Identify the parts of the URL
    let protocol = "";
    let domain = "";
    let path = "";
    let queryParams = "";

    // Step 2: Determine the protocol
    if (urlString.startsWith("http://")) {
        protocol = "http://";
        urlString = urlString.slice(protocol.length);
    } else if (urlString.startsWith("https://")) {
        protocol = "https://";
        urlString = urlString.slice(protocol.length);
    } else {
        protocol = "https://";
    }

    // Step 3: Extract the domain or hostname
    if (urlString.includes("/")) {
        domain = urlString.split("/")[0];
        urlString = urlString.slice(domain.length);
    } else {
    
        domain = urlString;

        urlString = "";
    }

    // Step 4: Extract the path or resource
    if (urlString.includes("?")) {
        path = urlString.split("?")[0];
        queryParams = urlString.slice(path.length);
    } else {
        path = urlString;
    }

    // Step 5: Extract the query parameters
    if (queryParams.startsWith("?")) {
        queryParams = queryParams.slice(1);
    }

    // Step 6: Assemble the URL
    let url = protocol + domain + path;
        if (queryParams) {
        url += "?" + queryParams;
    }

    return url;
}

function objectToQueryString(object) {

    return Object.keys(object).reduce((a, b) => {

        if(object[b])   {
            a.push(`${encodeURIComponent(b)}=${encodeURIComponent(object[b])}`)
        }

        return a;
    }, []).join("&");
    
}

function queryStringToObject(urlString, trailingSlash = false)   {
    let url = new URL(urlString),
        queryString = url.search.length ? url.search.slice(1) : "",
        origin = url.origin.charAt(url.origin.length - 1) === "/" ? url.origin.slice(0, -1) : url.origin,
        urlPath = url.pathname.split("/").filter(item => item.length > 0).join("/"),
        pathname = trailingSlash ? `${urlPath}/` : urlPath,
        queryArr = queryString.length ? queryString.split("&") : [],
        queryObject = queryArr.reduce((a,b) => {
            let [key, val] = b.split("=");
            a[decodeURIComponent(key)] = decodeURIComponent(val);
            return a;
        }, {});

    return {
        queryObject,
        originalUrl : urlString,
        origin,
        pathName : pathname,
        queryString : objectToQueryString(queryObject),
        urlWithoutQueryString : [origin, pathname].join("/"),
    };
}


module.exports = {
    urlConstructor,
    objectToQueryString,
    queryStringToObject
};