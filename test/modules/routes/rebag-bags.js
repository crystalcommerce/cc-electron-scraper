// const { Router } = require("express");
// const router = Router();

// const tcgTcgPlayerFleshAndBloodsDb = require('../../models/dynamic/tcg-tcg-player-flesh-and-blood');
// const getControllers = require("../../controllers");
// const { controllers : { dynamic } } = getControllers(tcgTcgPlayerFleshAndBloodsDb);
// const { httpResponseHandler } = require("../../middlewares");
// const { filterObjectsByMethodName } = require("../../utilities");
// const getMiddleWaresByName = filterObjectsByMethodName(httpResponseHandler(), ...dynamic);


module.exports = function(express, rebagBagsDb, getDynamicController)   {

    const {Router} = express;
    const router = Router();
    const {
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
    } = getDynamicController(rebagBagsDb);

	// getAll Handler
	router.get("/rebag-bags/", getAll);


	// getOneByFilter hanlder
	router.get("/rebag-bags/single?", getOneByFilter);


	// getAllFiltered hanlder
	router.get("/rebag-bags/all?", getAllFiltered);


	// getPaginatedResults hanlder
	router.get("/rebag-bags/paginated?", getPaginatedResults);


	// getOneById handler
	router.get("/rebag-bags/:id", getOneById);


	// create
	router.post("/rebag-bags/", create);


	// updateHandler
	router.put("/rebag-bags/:id", update);


	// deleteAllFilteredHandler
	router.delete("/rebag-bags/all?", deleteAllFiltered);


	// deleteHandler
	router.delete("/rebag-bags/:id", deleteById);


	return router;

}


// let obj = {
//     "fileName" : "rebag-bags",
//     "fileType" : "js",
//     "fileNameWithExt" : "rebags-bags.js",
//     "textData" : ""
// }