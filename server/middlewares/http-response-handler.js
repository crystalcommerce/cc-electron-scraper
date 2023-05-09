const { getRequestResult } = require("../../utilities");

module.exports = function()  {
    return function(req, res, next) {
        if(req.requestResult) {
            let { status, message, data } = req.requestResult,
                contentType = req.requestResult.contentType || "application/json",
                response = data ? getRequestResult(data, status, contentType) : getRequestResult({data, status, message}, status, contentType);
        
            
            /**************************************************
            ***************************************************
            * 
            *  We are going to replace the new array of stack 
            *  with the previous stack before we added 
            *  the dynamic route handler;
            * 
            *  Since arrays are reference data type, 
            *  we are directly affecting the router object's 
            *  array of stack which are the route handlers;
            *  
            **************************************************
            *************************************************/

            // if(req.dynamicRouter && req.previousStack)   {
            //     req.dynamicRouter.stack = req.previousStack;
            // }

            res.setHeader("Content-Type", response.contentType).status(response.status).send(response.data);



        } else  {

            next();

        }
    }
}