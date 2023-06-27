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

            let { scrollToBottom, slowDown, queryStringToObject, objectToQueryString, moderator, waitForSelector, isObjectInArray } = utilityProps;

            await scrollToBottom(700);

            // await scrollToTop();

            await slowDown(2525);


            
            let { setData, setId, startingPointUrl } = dataProps,
                newUrl = null,
                clickableRows = Array.from(document.querySelectorAll("table[aria-describedby^='collection-table'] tbody tr[aria-label^='Product']")),
                branchViewList = Array.from(document.querySelectorAll("ul[data-testid^='branch-view-list']  li  a[data-test-id^='branch-item']")),
                productObjects = [];

            if(clickableRows.length)    {
                await moderator(clickableRows, async (slicedArr) => {
                
                    let [clickableRow] = slicedArr;
    
                    clickableRow.click();
    
                    await waitForSelector(() => clickableRow.querySelector("a[data-test-id^='product-detail-link']"));
    
                    let productLink =  clickableRow.querySelector("a[data-test-id^='product-detail-link']"),
                        productUri = productLink ? productLink.href : null,
                        productObject = {
                            setId,
                            ...setData,
                            productUri
                        };
    
                    if(productUri && !isObjectInArray(productObject, productObjects, ["productUri"]))  {
                        productObjects.push(productObject);
                    }
    
                }, 1);
            } else if(branchViewList.length)  {
                let products =  branchViewList.map(item => {
                    return {
                        setId,
                        ...setData,
                        productUri : item.href,
                    }
                });

                for(let productObject of products)    {
                    if(productObject.productUri && !isObjectInArray(productObject, productObjects, ["productUri"]))  {
                        productObjects.push(productObject);
                    }
                }
                
            }
            

            return {
                productObjects,
                newUrl,
            }

        },
        waitForSelectors : [
            "#category-container"
        ]
    },
    single : [
        {
            callback : async (utilityProps, dataProps) => {
    
                let {scrollToBottom, slowDown, scrollToTop} = utilityProps;
    
                await scrollToBottom(700);
    
                // await scrollToTop();
    
                await slowDown(2525);
    
    
                let container = document.querySelector(".content-ui"),
                    imageElements = Array.from(container.querySelectorAll("div[data-testid^='product-image-to-zoom'] img[alt^='Main product photo']")),
                    productDetailsContainer = container.querySelector("dl[data-testid^='product-techs']"),
                    productDescriptionContainer = container.querySelector("div[data-testid^='product-description'] dd p"),
                    productNameContainer = container.querySelector("div[data-testid^='pdp-header'] h1"),//pdp-header
                    productDescription = function(){
                        return productDescriptionContainer.innerText.trim().replace(/\r\n+/g, ' <br />');
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
                        return productNameContainer.innerText.trim().replace(/\r\n+/g, ' <br />');
                    }(),
                    additionalProductDetails = {
                        productName,
                        productBrand,
                        productDescription,
                        productDetails,
                        imageUris,
                    }
    
                return {...dataProps, ...additionalProductDetails};
    
            },
            waitForSelectors : [
                "div[data-testid^='product-gallery']"
            ],
            uriPropName : "productUri",
        }
    ]
}