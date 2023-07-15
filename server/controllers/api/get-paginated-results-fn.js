const { objectToQueryString, apiRequest } = require("../../../utilities");

module.exports = async function(apiUrl, filter, page = 1, limit = 5)  {

    let queryString = objectToQueryString(filter),
        url = `${apiUrl}/paginated?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}&${queryString}`,
        getResult = await apiRequest(url, {
            method : "GET",
            headers : {
                "Content-Type" : "application/json",
            },
        }, true),
        { pageTotal : initialPageTotal, totalCount, data } = getResult;

    console.log({
        page,
        limit
    });
    
    return {
        callback : async function(newPage) {

            if(newPage > initialPageTotal)    {
                return;
            }
            
            let selectedPage = newPage ? newPage : page;

            url = `${apiUrl}/paginated?page=${encodeURIComponent(selectedPage)}&limit=${encodeURIComponent(limit)}&${queryString}`;

            let getResult = await apiRequest(url, {
                method : "GET",
                headers : {
                    "Content-Type" : "application/json",
                },
            }, true),
            { pageTotal, totalCount } = getResult;

            console.log({pageTotal, totalCount, page : selectedPage});

            page = selectedPage;
            page = parseInt(page) + 1;

            return getResult;
        },
        pageTotal : initialPageTotal,
        totalCount,
        page : parseInt(page),
        data

    };
    
}