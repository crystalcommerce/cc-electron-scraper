const getPaginatedResultsFn = require("../../../server/controllers/api/get-paginated-results-fn");

module.exports = async function ({serverUrl, apiEndpoint, filter, currentPage, limit})  {
    let apiUrl = `${serverUrl}/api/${apiEndpoint}`,
        { callback, page, pageTotal, data, totalCount } = await getPaginatedResultsFn(apiUrl, filter, currentPage, limit);

    return {
        callback, 
        page, 
        pageTotal,
        data,
        apiUrl,
        serverUrl,
        totalCount
    }
}