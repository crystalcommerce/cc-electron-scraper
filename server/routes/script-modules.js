const router = require("express").Router();
const getDynamicController = require("../controllers/index");
const httpResponseHandler = require("../middlewares/http-response-handler");
const scriptsDb = require("../models/scripts-db");

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
	} = getDynamicController(scriptsDb);

    // getAll Handler
	router.get("/modules/scripts", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/modules/scripts/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/modules/scripts/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/modules/scripts/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/modules/scripts/:id", getOneById, httpResponseHandler());


	// create
	router.post("/modules/scripts/", create, httpResponseHandler());


	// updateHandler
	router.put("/modules/scripts/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/modules/scripts/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/modules/scripts/:id", deleteById, httpResponseHandler());



    return router;
}

