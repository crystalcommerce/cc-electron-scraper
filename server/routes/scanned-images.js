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

	const baseApiRouteName = "/scanned-images";

    // getAll Handler
	router.get(`${baseApiRouteName}/`, getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get(`${baseApiRouteName}/single?`, getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get(`${baseApiRouteName}/all?`, getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get(`${baseApiRouteName}/paginated?`, getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get(`${baseApiRouteName}/:id`, getOneById, httpResponseHandler());


	// create
	router.post(`${baseApiRouteName}/`, create, httpResponseHandler());

	// create
	router.post(`${baseApiRouteName}/create-multiple`, createMultiple, httpResponseHandler());


	// updateHandler
	router.put(`${baseApiRouteName}/:id`, update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete(`${baseApiRouteName}/all?`, deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete(`${baseApiRouteName}/:id`, deleteById, httpResponseHandler());


	return router;
}

