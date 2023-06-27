module.exports = {
    categorizedSets : {
        callback : async (utilityProps, dataProps) => {

            let {scrollToBottom, slowDown, scrollToTop} = utilityProps;

            await scrollToBottom(700);

            await scrollToTop();

            await slowDown(2525);

            let categorizedSets = Array.from(document.querySelectorAll(".bc-sf-filter-option-block-bag-type .bc-sf-filter-option-multiple-list li > a")).map(item => {
                let url = item.href.trim(),
                    productsTotal = item.querySelector(".bc-sf-filter-option-amount") ? Number(item.querySelector(".bc-sf-filter-option-amount").innerText.trim().replace(/[^\w\s]/gi, "")) : null,
                    setData = {
                        category : "Bags",
                        subcategory : item.querySelector(".bc-sf-filter-option-value") ? item.querySelector(".bc-sf-filter-option-value").innerText.trim() : null,
                    };

                return {
                    url,
                    productsTotal,
                    setData,
                }
            });

            return categorizedSets;

        },
        waitForSelectors : [
            ".bc-sf-filter-option-block-bag-type .bc-sf-filter-option-multiple-list", 
            ".product-view-details"
        ],
        startingPointUrl : "https://shop.rebag.com/collections/all-bags?_=pf&pf_st_availability_hidden=true",
    },
    set : {
        callback : async (utilityProps, dataProps) => {

            let { scrollToBottom, slowDown, queryStringToObject, objectToQueryString } = utilityProps;

            await scrollToBottom(700);

            // await scrollToTop();

            await slowDown(2525);


            
            let { setData, setId, startingPointUrl } = dataProps,
                newUrl = function(){
                    let nextLink = document.querySelector(".rbg-pagination__ul .next a");

                    if(!nextLink || nextLink.parentElement.classList.contains("disabled"))    {
                        return null;
                    }

                    let currentUrl = window.location.href,
                        { queryObject, urlWithoutQueryString } = queryStringToObject(currentUrl),
                        currentPage = queryObject && queryObject.page ? parseInt(queryObject.page) : 1,
                        nextPage = currentPage + 1;

                    queryObject.page = nextPage;

                    let queryString = objectToQueryString(queryObject);

                    return `${urlWithoutQueryString}?${queryString}`;
                    
                }(),
                productObjects = Array.from(document.querySelectorAll(".plp-product")).map(container => {
                    let imageUris = Array.from(container.querySelectorAll(".product-image-wrap img")).map(img => {
                            let src = img.src,
                                largeImage = function(){
                                    let urlObj = new URL(src),
                                        pathNameArr = urlObj.pathname.split("/"),
                                        file = pathNameArr.pop(),
                                        fileExt = file.split(".").pop(),
                                        fileName = file.split(".").shift().split("/").pop(),
                                        fileSize = fileName.split("_");

                                    fileSize.pop();

                                    
                                    let newFileName = `${fileSize.join("_")}.${fileExt}`;

                                    pathNameArr.push(newFileName);

                                    return `${urlObj.origin}${pathNameArr.join("/")}${urlObj.search}`;

                                }();

                            return largeImage;
                        }),
                        productUri = container.querySelector("a") ? container.querySelector("a").href : null,
                        productBrand = container.querySelector(".product-vendor") ? container.querySelector(".product-vendor").innerText.trim("").replace(/\r\n+/g, ' <br />') : null,
                        productName = productBrand && container.querySelector(".product-title") ?`${productBrand} - ${container.querySelector(".product-title").innerText.trim("").replace(/\r\n+/g, ' <br />')}` : productBrand ? productBrand : null,
                        productCondition = container.querySelector(".product-condition") ? container.querySelector(".product-condition").innerText.trim("").replace(/\r\n+/g, ' <br />') : null,
                        originalPrice = container.querySelector(".product-price .bc-sf-filter-product-item-original-price") ? container.querySelector(".product-price .bc-sf-filter-product-item-original-price").innerText.trim("").replace(/\r\n+/g, ' <br />') : null,
                        regularPrice = container.querySelector(".product-price .bc-sf-filter-product-item-regular-price") ? container.querySelector(".product-price .bc-sf-filter-product-item-regular-price").innerText.trim("").replace(/\r\n+/g, ' <br />') : null;

                    return {
                        categorizedSetId : setId,
                        ...setData,
                        productName,
                        productBrand,
                        imageUris,
                        productUri,
                        originalPrice,
                        regularPrice
                    }
                });

            return {
                productObjects,
                newUrl,
            }

        },
        waitForSelectors : [
            ".plp__products-grid-container"
        ]
    },
    single : [
        {
            callback : async (utilityProps, dataProps) => {
    
                let {scrollToBottom, slowDown, scrollToTop} = utilityProps;
    
                await scrollToBottom(700);
    
                await scrollToTop();
    
                await slowDown(2525);
    
    
                let container = document.querySelector(".pdp__section--overview"),
                    excludedKeys = ["Store Location", "store location"],
                    additionalProductDetails = function(){
                        let productObject = {};
    
                        if(container)   {
    
                            Array.from(container.querySelectorAll(".pdp__section-content .pdp__section-group")).forEach(section => {
    
                                let key = section.querySelector(".pdp__group-title") ? section.querySelector(".pdp__group-title").innerText.trim().replace(/\r\n+/g, ' <br />') : null,
                                    val = function(){
                                        let res = Array.from(section.querySelectorAll(".pdp__group-item .pdp__group-item"));
    
                                        if(res.length)  {
                                            return res.map(item => item.innerText.trim().replace(/\r\n+/g, ' <br />')).join(" <br />");
                                        } else  {
                                            return section.querySelector(".pdp__group-item") ? section.querySelector(".pdp__group-item").innerText.trim().replace(/\r\n+/g, ' <br />') : null;
                                        }
                                    }();
                                
                                if(key && val && !excludedKeys.includes(key)) {
                                    productObject[key] = val;
                                }
                            })
    
    
                        }
    
                        return productObject;
                    }();
    
                return {...dataProps, ...additionalProductDetails};
    
            },
            waitForSelectors : [
                ".pdp__section--overview"
            ],
            uriPropName : "productUri",
        }
    ]
}