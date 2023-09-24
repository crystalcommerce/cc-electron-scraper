module.exports = {
    categorizedSets : {
        callback : async (utilityProps, dataProps) => {

            let { scrollToBottom, slowDown, queryStringToObject, objectToQueryString } = utilityProps;

            await scrollToBottom(340);

            // await scrollToTop();

            await slowDown(2525);

            

            function getStartingPointUrl()  {

                let categoryObject = dataProps,
                    categoryLinks = Array.from(document.querySelectorAll(".-jeeqs > li > a")),
					branchViewList = Array.from(document.querySelectorAll("ul[data-testid^='branch-view-list']  li  a[data-test-id^='branch-item']")),
					newCategorizedSets = [];

                console.log(categoryObject);

                if(!categoryLinks.length && !branchViewList.length)    {

                    return newCategorizedSets;
                    
                } else  {
                    // replace the categoryObject item from the categorizedSetsArr;

					if(categoryLinks.length)	{

						newCategorizedSets = categoryLinks.map(item => {

                            let obj = {
                                startingPointUrl : item.href,
                                ...categoryObject,
                            }

                            if(obj.setData)  {
                                // means this is a second or more attempt
                                if(!obj.setData.additionalCategoryTags && !Array.isArray(obj.setData.additionalCategoryTags))   {
                                    obj.setData.additionalCategoryTags = [];
                                }
                                
                                if(!obj.setData.additionalCategoryTags.includes(obj.setData.subcategory))   {
                                    obj.setData.additionalCategoryTags.push(obj.setData.subcategory);
                                }

                                obj.setData.subcategory = item.title;
                                obj.startingPointUrl = item.href;

                            } else  {
                                // means first attempt

                                obj.setData = {
                                    category : "Packaging & Shipping",
                                    subcategory : item.title,
                                }

                            }

                            return obj;
	
						});

					} else if(branchViewList.length)	{


						newCategorizedSets = branchViewList.map(item => {
	
							let obj =  {
								...categoryObject,
								startingPointUrl : item.href,
								// additionalCategoryTag,
							};
                            

                            if(obj.setData)  {
                                // means this is a second or more attempt
                                if(!obj.setData.additionalCategoryTags && !Array.isArray(obj.setData.additionalCategoryTags))   {
                                    obj.setData.additionalCategoryTags = [];
                                }
                                
                                if(!obj.setData.additionalCategoryTags.includes(subcategory))    {
                                    obj.setData.additionalCategoryTags.push(obj.setData.subcategory);
                                }
                                
                                obj.setData.subcategory = item.innerText.trim();
                                obj.startingPointUrl = item.href;

                            } else  {
                                // means first attempt

                                obj.setData = {
                                    category : "Packaging & Shipping",
                                    subcategory : item.innerText.trim(),
                                }

                            }

                            return obj;
	
						});

					}


                    // replaceCategoryObject(categoryObject, categorizedSetsArr, newCategorizedSets);

                    console.log(newCategorizedSets);

                    return newCategorizedSets;
                }

            }

            return getStartingPointUrl();
            
        },
        waitForSelectors : [
            "#content-ui img"
        ],
        startingPointUrl : "https://www.grainger.com/category/packaging-shipping",
        recursive : true,
    },
    set : {
        callback : async (utilityProps, dataProps) => {

            document.body.style.height = "auto";

            let { scrollToBottom, slowDown, scrollToElement, scrollToTop, queryStringToObject, objectToQueryString, moderator, waitForCondition, waitForSelector, isObjectInArray } = utilityProps;

            await slowDown(2525);

            await scrollToBottom(340);


            await slowDown(3434);

            await scrollToTop();

            await slowDown(2525);

            let { setData, _id : categorizedSetId, startingPointUrl } = dataProps,
                newUrl = null,
                categorySections = Array.from(document.querySelectorAll("#category-container section")),
                gridList = Array.from(document.querySelectorAll("[aria-label='Category products'] ul[data-testid='grid-list']  li  a[data-testid='product-detail-title']")),
                productObjects = [];

            
            
            async function getProductInfo(productId)    {

                try {
                    let url = `https://www.grainger.com/product/info?productArray=${productId}`,
                    res = await fetch(url),
                    data = await res.json(),

                    productInfo = getProductDetails(data[productId]);

                    return productInfo;
                } catch(err)    {
                    return {};
                }
                
            }

            function getProductDetails(obj) {
                let {
                    productDetailUrl : productUri,
                    pictureUrl : imageUrl
                } = obj

                return {
                    productUri : `https://www.grainger.com${productUri}`,
                    imageUris : [`https:${imageUrl}`],
                }
            }

            async function getTableRows(table)   {

                    // await scrollToElement(table);

                    let tableRows = Array.from(table.querySelectorAll("tbody tr"));

                    return tableRows;
            }

            async function getDataFromTableRows(tableRows)    {
                await moderator(tableRows, async (tRows) => {
                        
                    let [tableRow] = tRows;

                    // await scrollToElement(tableRow);

                    let attr = tableRow.getAttribute("aria-label"),
                        productId = attr ? attr.split(" ").pop() : null;

                    console.log(productId);    

                    if(productId)   {
                        // get the product info
                        let additionalProductDetails = await getProductInfo(productId);


                        if(additionalProductDetails.productUri && additionalProductDetails.productUri !== "") {
                            
                            let productObject = {
                                categorizedSetId,
                                ...setData,
                                ...additionalProductDetails
                            };
    
                            console.log(productObject); 
    
                            productObjects.push(productObject);
                        }

                    }
                    
                }, 1);

            }

            // application of scraping starts here...

            if(categorySections.length)    {

                await moderator(categorySections, async (slicedArr) => {

                    let [categorySection] = slicedArr;

                    await scrollToElement(categorySection);

                    console.log("waiting for table element");
                    await waitForSelector(() => categorySection.querySelector("table"));
                    
                    let tables = Array.from(categorySection.querySelectorAll("table"));

                    await moderator(tables, async (slicedTablesArr) => {

                        let [table] = slicedTablesArr;

                        // await scrollToElement(table);

                        let tableRows = await getTableRows(table);

                        await getDataFromTableRows(tableRows);

                    }, 1);
                    
                }, 1);

            } else if(gridList.length)  {
                productObjects = gridList.map(item => {
                    let productUri = item.href,
                        productObject = {
                            categorizedSetId,
                            ...setData,
                            productUri
                        };
                    return productObject;
                }).filter(item => item.productUri);

                await slowDown(3434);
            }

            await slowDown(3434);
            

            return {
                productObjects,
                newUrl,
            }

        },
        waitForSelectors : [
            "#content-ui"
        ]
    },
    single : [
        {
            callback : async (utilityProps, dataProps) => {
    
                let {scrollToBottom, slowDown, scrollToTop} = utilityProps;
    
                await scrollToBottom(340);
    
                // await scrollToTop();
    
                await slowDown(2525);
    
                try {
                    let container = document.querySelector(".content-ui"),
                    imageElements = Array.from(container.querySelectorAll("div[data-testid^='product-image-to-zoom'] img[alt^='Main product photo']")),
                    productDetailsContainer = container.querySelector("dl[data-testid^='product-techs']"),
                    productDescriptionContainer = container.querySelector("div[data-testid^='product-description'] dd p"),
                    productNameContainer = container.querySelector("div[data-testid^='pdp-header'] h1"),//pdp-header
                    productDescription = function(){
                        return productDescriptionContainer ? productDescriptionContainer.innerText.trim().replace(/\r\n+/g, ' <br />') : null;
                    }(),
                    productBrand = null,
                    productDetails = function(){
                        return Array.from(productDetailsContainer.querySelectorAll("div")).map(div => {
                            let [dt, dd] = Array.from(div.querySelectorAll("dt, dd")).map(item => item.innerText.trim().replace(/\r\n+/g, ' <br />'));

                            if(dt === "Brand")  {
                                productBrand = dd;
                            }

                            return  `${dt} : ${dd}`;
                        }).join("<br /> ");
                    }(),
                    imageUris = function(){
                        return imageElements.map(item => item.src);
                    }(),
                    productName = function(){
                        return productNameContainer ? productNameContainer.innerText.trim().replace(/\r\n+/g, ' <br />') : null;
                    }(),
                    additionalProductDetails = {
                        productName,
                        productBrand,
                        productDescription,
                        productDetails,
                        imageUris,
                    }
    
                    return {...dataProps, ...additionalProductDetails};
                } catch(err)    {
                    return {...dataProps};
                }
                
            },
            waitForSelectors : [
                "#content-ui"
            ],
            uriPropName : "productUri",
        }
    ]
}