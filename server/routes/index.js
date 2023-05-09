const { Router } = require("express");
const router = Router();

// modules
const modelModules = require("./model-modules");
const routeModules = require("./route-modules");
const scriptModules = require("./script-modules");

// dynamic
const dynamicRoutes = require("./dynamic-routes");
// categorized-sets
const categorizedSetsRouteHandler = require("./categorized-sets");

// detect watermarks
const detectWatermark = require("./detect-watermark");

// scanned-images
const scannedImagesRouteHandler = require("./scanned-images");

// Error 404 Router
const error404 = require('./error404');

module.exports = function(routeModelObjects)   {
    
    // modules
    router.use("/api", modelModules());
    router.use("/api", routeModules());
    router.use("/api", scriptModules());

    // categorized-sets
    router.use("/api", categorizedSetsRouteHandler())

    // dynamically written routeHandlers;
    router.use("/api", dynamicRoutes(routeModelObjects));

    // watermark detection routeHandler;
    router.use("/api", detectWatermark());

    // scanned images route handler
    router.use("/api", scannedImagesRouteHandler());

    // 404 handler route
    router.use("/api", error404());

    return router;

}