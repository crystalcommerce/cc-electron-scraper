module.exports = {
    categorizedSets : {
        callback : async (utilityProps, dataProps) => {

            let {scrollToBottom, slowDown, scrollToTop} = utilityProps,
                { siteName, siteUrl } = dataProps;

            await scrollToBottom(340);

            await scrollToTop();

            await slowDown(2525);

            let categorizedSets = Array.from(document.querySelectorAll("nav[role='navigation'] div[data-menu-id]")).slice(0, 11).map(item => {
                let category = item.getAttribute("data-menu-id"),
                    container = item,
                    menuContainer = Array.from(container.querySelectorAll(".od-header-flyout-menu ul li a")).map(item => {
                        let url = item.href,
                            subcategory = item.title && item.title !== "" ? item.title : item.innerText.trim();
                            
                        return {
                            siteUrl,
                            siteName,
                            setData : {
                                category,
                                subcategory,
                            },
                            startingPointUrl : url,
                        }
                    });
                return menuContainer
            }).reduce((a, b) => {

                a.push(...b);

                return a;

            }, []);

            return categorizedSets;

        },
        waitForSelectors : [
            ".od-header-flyout-menu"
        ],
        startingPointUrl : "https://www.officedepot.com/",
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
                productObjects = Array.from(document.querySelectorAll(".od-container > .od-row .od-product-card .od-product-card-region-visual a")).map(item => {
                    let productUri = item.href;

                    return {
                        categorizedSetId,
                        ...setData,
                        productUri
                    }

                }),
                nextButton = document.querySelector(`button[data-auid="OdSearchBrowse_OdButton_ProductSearch'next'"]`);

            if(!nextButton.disabled)    {
                let {queryObject, urlWithoutQueryString} = queryStringToObject(window.location.href);

                queryObject.page = Number(queryObject.page) + 1;

                newUrl = `${urlWithoutQueryString}?${objectToQueryString(queryObject)}`;
            }
            

            return {
                productObjects,
                newUrl,
            }

        },
        waitForSelectors : [
            ".od-container > .od-row .od-product-card"
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
                    let productNameContainer = document.querySelector("h1[itemprop='name']"),
                        priceContainer = document.querySelector(".od-graphql-price-little-price"),
                        productName = productNameContainer ? productNameContainer.innerText.trim() : '',
                        imageUris = Array.from(document.querySelectorAll(".image-gallery-slides .image-gallery-image-container img")).map(item => item.src),
                        productBrand = null,
                        manufacturer = null,
                        manufacturerNumber = null,
                        itemNumber = null,
                        price = priceContainer ? priceContainer.innerText.trim() : "",
                        additionalProductDetails = function() {
                            let additionalProductDetails = {},
                                [descObj, specsObject] = Array.from(document.querySelectorAll(".tabs-content .tab-content-item")).slice(0, 2).map((tabContainer, index) => {
                                    if(index === 0 && tabContainer.querySelector(".label-print-description")){
                                        let descriptionContainer = tabContainer.querySelector("[itemprop='description']"),
                                            productDescription = descriptionContainer ? descriptionContainer.innerText.trim().replace(/\r\n+/g, ' <br />') : "",
                                            skuBullets = Array.from(tabContainer.querySelectorAll(".sku-bullet")).map(item => item.innerText.trim()).reduce((a, b, index) => {
                                                if(index > 0)   {
                                                    a += " <br />";
                                                }
                                                a += b;
                                                return a;
                                            }, "");
            
                                        return {
                                            productDescription,
                                            skuBullets,
                                        }
                                    } else if(index > 0 && tabContainer.querySelector(".sku-specifications")){
                                        let specsObject = Array.from(tabContainer.querySelectorAll(".sku-table tbody tr")).map(item => {
                                            let [key, val] = Array.from(item.querySelectorAll("td")).map(item => item.innerText.trim());
            
                                            return [key, val];
                                        }).reduce((a,b) => {
                                            let [key, val] = b,
                                                searchTerm = key.toLowerCase().split(" ").map(item => item.trim()).join(" ");
            
                                            if(searchTerm.includes("brand name"))    {
                                                productBrand = val;
                                            } else if(searchTerm === "manufacturer")    {
                                                manufacturer = val;
                                            } else if(searchTerm === "manufacturer #")    {
                                                manufacturerNumber = val
                                            } else if(searchTerm === "item #")    {
                                                itemNumber = val
                                            } else  {
                                                a[key] = val;
                                            }
            
                                            return a;
                                        }, {});
            
                                        return specsObject;
                                    } else {
                                        return {};
                                    }
                                });

                            if(descObj) {
                                additionalProductDetails.productDescription = descObj.productDescription;
                                additionalProductDetails.skuBullets = descObj.skuBullets;
                            }

                            if(specsObject) {
                                let output = "";
                                console.log(specsObject);
                                for(let key in specsObject) {
                                    output += `${key} : ${specsObject[key]}<br />`;
                                }
                                additionalProductDetails.specs = output;
                            }

                            return additionalProductDetails
                        }();


                    return {
                        productName,
                        productBrand,
                        imageUris,
                        ...dataProps,
                        itemNumber,
                        manufacturer,
                        manufacturerNumber,
                        price,
                        ...additionalProductDetails
                    };
                
                } catch(err)    {
                    console.log(err.message);
                    return {...dataProps};
                }
                
            },
            waitForSelectors : [
                ".od-graphql-price-little-price"
            ],
            uriPropName : "productUri",
        }
    ]
}