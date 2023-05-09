const router = require("express").Router();
const getDynamicController = require("../controllers/index");
const httpResponseHandler = require("../middlewares/http-response-handler");
const categorizedSetsDb = require("../models/categorized-sets");

module.exports = function()   {

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
	} = getDynamicController(categorizedSetsDb);

    // getAll Handler
	router.get("/categorized-sets", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/categorized-sets/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/categorized-sets/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/categorized-sets/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/categorized-sets/:id", getOneById, httpResponseHandler());


	// create
	router.post("/categorized-sets/", create, httpResponseHandler());


	// updateHandler
	router.put("/categorized-sets/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/categorized-sets/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/categorized-sets/:id", deleteById, httpResponseHandler());



    return router;
}

