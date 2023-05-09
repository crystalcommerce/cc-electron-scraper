const router = require("express").Router();
const getDynamicController = require("../controllers/index");
const httpResponseHandler = require("../middlewares/http-response-handler");
const modelsDb = require("../models/models-db");

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
	} = getDynamicController(modelsDb);

    // getAll Handler
	router.get("/modules/models", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/modules/models/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/modules/models/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/modules/models/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/modules/models/:id", getOneById, httpResponseHandler());


	// create
	router.post("/modules/models/", create, httpResponseHandler());


	// updateHandler
	router.put("/modules/models/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/modules/models/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/modules/models/:id", deleteById, httpResponseHandler());



    return router;
}

