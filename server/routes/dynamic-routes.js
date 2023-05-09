const { Router } = require("express");
const router = Router();

module.exports = function(routeModelObjects) {

    for(let routeHandler of routeModelObjects)   {

        router.use(routeHandler);

    }

    return router;
}