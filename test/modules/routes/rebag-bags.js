module.exports = function(Router, rebagBagsDb, getDynamicController, httpResponseHandler)   {

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
	router.get("/rebag-bags/", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/rebag-bags/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/rebag-bags/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/rebag-bags/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/rebag-bags/:id", getOneById, httpResponseHandler());


	// create
	router.post("/rebag-bags/", create, httpResponseHandler());


	// updateHandler
	router.put("/rebag-bags/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/rebag-bags/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/rebag-bags/:id", deleteById, httpResponseHandler());


	return router;

}