const router = require("express").Router();
const getDynamicController = require("../controllers/index");
const httpResponseHandler = require("../middlewares/http-response-handler");
const scannedImagesDb = require("../models/scanned-images-db");

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
	} = getDynamicController(scannedImagesDb);

    // getAll Handler
	router.get("/scanned-images", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/scanned-images/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/scanned-images/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/scanned-images/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/scanned-images/:id", getOneById, httpResponseHandler());


	// create
	router.post("/scanned-images/", create, httpResponseHandler());


	// updateHandler
	router.put("/scanned-images/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/scanned-images/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/scanned-images/:id", deleteById, httpResponseHandler());



    return router;
}

