const router = require("express").Router();
const getDynamicController = require("../controllers/index");
const httpResponseHandler = require("../middlewares/http-response-handler");
const routesDb = require("../models/routes-db");

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
	} = getDynamicController(routesDb);

    // getAll Handler
	router.get("/modules/routes", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/modules/routes/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/modules/routes/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/modules/routes/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/modules/routes/:id", getOneById, httpResponseHandler());


	// create
	router.post("/modules/routes/", create, httpResponseHandler());


	// updateHandler
	router.put("/modules/routes/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/modules/routes/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/modules/routes/:id", deleteById, httpResponseHandler());



    return router;
}

