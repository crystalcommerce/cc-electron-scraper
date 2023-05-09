module.exports = function(modelInstanceDb) {

    let { recordName } = modelInstanceDb;

    async function getAll(req, res, next)  {

        try {
            let result = await modelInstanceDb.getAll();
            req.requestResult = {data : result, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 404, message : err.message};
            next();
        }

    }

    async function getOneById(req, res, next)  {

        try {
            let result = await modelInstanceDb.getById(req.params.id);
            if(!result) throw Error(`${recordName} not found`);
            req.requestResult = {data : result, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 404, message : err.message};
            next();
        }
        
    }

    async function getOneByFilter(req, res, next)  {
        try {
            let filter = req.query,
                result = await modelInstanceDb.getOneByFilter(filter);
            if(!result) throw Error(`${recordName} not found`);
            req.requestResult = {data : result, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 404, message : err.message};
            next();
        }

    }

    async function getAllFiltered(req, res, next)  {
        
        try {
            let filter = req.query,
                result = await modelInstanceDb.getAllFilteredData(filter);
                req.requestResult = {data : result, status : 200};
                next();
            } catch(err)    {
                req.requestResult = {status : 404, message : err.message};
                next();
        }
    }


    async function getPaginatedResults(req, res, next) {

        try {
            let filter = req.query,
                { page, limit } = filter,
                query = Object.keys(filter).filter(key => key !== "page" && key !== "limit").reduce((a, b) => {
                    a[b] = filter[b];
                    return a;
                }, {});

            console.log({
                page,
                limit
            });
            
            // setting page and limit if they were not part of the query string;
            page = page ? page : 1;
            limit = limit ? Number(limit) : 10;

            let pageObject = {
                    limit,
                    skip : (page - 1) * limit,
                },
                result = await modelInstanceDb.getPaginatedResults(query, null, pageObject);

                req.requestResult = {data : result, status : 200};
                next();
            } catch(err)    {
                req.requestResult = {status : 404, message : err.message};
                next();
        }

    }


    async function create(req, res, next)   {

        try {

            let result = await modelInstanceDb.create(req.body);
            if(result.statusOk === false)   {
                throw Error(result.message);
            }
            req.requestResult = {data : result, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 403, message : err.message};
            next();
        }
    }

    async function createMultiple(req, res, next)  {
        
        try {

            let result = await modelInstanceDb.createMultiple(req.body);

            req.requestResult = {data : result, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 403, message : err.message};
            next();
        }

    }

    async function update(req, res, next)   {
        
        try {
            let updateResult = await modelInstanceDb.update(req.params.id, req.body);

            req.requestResult = {data : updateResult, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 403, message : err.message};
            next();
        }
    }

    async function deleteById(req, res, next)   {
        try {
            let deleteResult = await modelInstanceDb.delete(req.params.id);

            req.requestResult = {data : deleteResult, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 403, message : err.message};
            next();
        }
    }

    async function deleteAllFiltered(req, res, next) {        

        try {
            let filter = req.query,
                filteredResult = await modelInstanceDb.getAllFilteredData(filter),
                promises = [];

            for(let product of filteredResult) {
                promises.push(async () => {
                    try {
                        deleteResult = await modelInstanceDb.delete(product._id.toString());

                        return deleteResult;
                    } catch(err) {
                        return {status : 403, message : err.message}
                    }
                });
            }
            

            let multipleDeleteResult = await Promise.all(promises.map(async item => await item()));
            
            if(!multipleDeleteResult.length) {
                throw Error(`We could did not get a filtered result for ${recordName}, which means we never got to delete any of the data.`)
            }

            req.requestResult = {data : multipleDeleteResult, status : 200};
            next();
        } catch(err)    {
            req.requestResult = {status : 403, message : err.message};
            next();
        }

    }

    return {
        getAll,
        getOneById,
        getOneByFilter,
        getAllFiltered,
        getPaginatedResults,
        create,
        createMultiple,
        update,
        deleteById,
        deleteAllFiltered,
    }

}