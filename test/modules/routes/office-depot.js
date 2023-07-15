module.exports = function(Router, officeDepotsDb, getDynamicController, httpResponseHandler)   {

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
	} = getDynamicController(officeDepotsDb);

	// getAll Handler
	router.get("/office-depots/", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/office-depots/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/office-depots/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/office-depots/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/office-depots/:id", getOneById, httpResponseHandler());


	// create
	router.post("/office-depots/", create, httpResponseHandler());


	// updateHandler
	router.put("/office-depots/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/office-depots/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/office-depots/:id", deleteById, httpResponseHandler());


	return router;

}