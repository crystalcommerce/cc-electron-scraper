module.exports = function(Router, graingerPackagingAndShippingSuppliesDb, getDynamicController, httpResponseHandler)   {

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
	} = getDynamicController(graingerPackagingAndShippingSuppliesDb);

	// getAll Handler
	router.get("/grainger-packaging-and-shipping-supplies/", getAll, httpResponseHandler());


	// getOneByFilter hanlder
	router.get("/grainger-packaging-and-shipping-supplies/single?", getOneByFilter, httpResponseHandler());


	// getAllFiltered hanlder
	router.get("/grainger-packaging-and-shipping-supplies/all?", getAllFiltered, httpResponseHandler());


	// getPaginatedResults hanlder
	router.get("/grainger-packaging-and-shipping-supplies/paginated?", getPaginatedResults, httpResponseHandler());


	// getOneById handler
	router.get("/grainger-packaging-and-shipping-supplies/:id", getOneById, httpResponseHandler());


	// create
	router.post("/grainger-packaging-and-shipping-supplies/", create, httpResponseHandler());


	// updateHandler
	router.put("/grainger-packaging-and-shipping-supplies/:id", update, httpResponseHandler());


	// deleteAllFilteredHandler
	router.delete("/grainger-packaging-and-shipping-supplies/all?", deleteAllFiltered, httpResponseHandler());


	// deleteHandler
	router.delete("/grainger-packaging-and-shipping-supplies/:id", deleteById, httpResponseHandler());


	return router;

}