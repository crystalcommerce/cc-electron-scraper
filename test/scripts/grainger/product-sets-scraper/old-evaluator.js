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

            document.body.style.height = "auto";

            let { scrollToBottom, slowDown, scrollToElement, scrollToTop, queryStringToObject, objectToQueryString, moderator, waitForCondition, waitForSelector, isObjectInArray } = utilityProps;

            await slowDown(2525);

            await scrollToBottom(700);


            await slowDown(3434);

            await scrollToTop();

            await slowDown(2525);

            let { setData, _id : categorizedSetId, startingPointUrl } = dataProps,
                newUrl = null,
                tables = Array.from(document.querySelectorAll("#category-container table")),
                gridList = Array.from(document.querySelectorAll("[aria-label='Category products'] ul[data-testid='grid-list']  li  a[data-testid='product-detail-title']")),
                productObjects = [];

            // get the table elements first;

            async function getExpandedRow(row)    {

                let expandedRow = null,
                    timer = 0,
                    timeout = setTimeout(() => {

                        timer++;

                    }, 1000),
                    conditionMet = null;

                await waitForCondition({
                    conditionCallback : () => {
                        let nextElementSibling = row.nextElementSibling,
                            expandedRow = row.parentElement.querySelector("tr[data-testid$='expanded-row']");
                        if(timer > 30 && !expandedRow)  {
                            conditionMet = false;
                            clearTimeout(timeout);
                            return true;
                        } else  {
                            conditionMet = true;
                            return nextElementSibling === expandedRow;
                        }
                    }, 
                    onTrueCallback : () => {
                        console.log("frame has loaded...");
                        if(conditionMet)    {
                            expandedRow = row.parentElement.querySelector("tr[data-testid$='expanded-row']");
                        }   
                        
                    }, 
                });

                return conditionMet && expandedRow ? expandedRow : null;

            }

            

            async function getData(expandedRow)    {

                await waitForSelector(() => expandedRow.querySelector(`td a[data-testid="product-detail-link"]`));

                let productLink =  expandedRow.querySelector(`td a[data-testid="product-detail-link"]`),
                    productUri = productLink ? productLink.href : null,
                    productObject = {
                        categorizedSetId,
                        ...setData,
                        productUri
                    };

                return productObject;
                
            }

            async function getNextRow(expandedRow, clickableRow)    {

                let tagName = expandedRow.tagName,
                    nextElementSibling = expandedRow.nextElementSibling !== clickableRow ? expandedRow.nextElementSibling : null,
                    nextElementSiblingTagName = nextElementSibling ? nextElementSibling.tagName : null;

                if(nextElementSibling)  {
                    let timer = 0,
                    timeout = setTimeout(() => {

                        timer++;
                        console.log("timer counting...", timer);
                    }, 1000),
                    conditionMet = null;

                    await waitForCondition({
                        conditionCallback : () => {
                            if(timer > 15)   {
                                clearTimeout(timeout);
                                conditionMet = false;

                                return true;
                            } else  {
                                conditionMet = true;
                                return nextElementSiblingTagName === tagName;
                            }
                        }, 
                        onTrueCallback : () => {
                            
                        }, 
                        onMessageCallback : () => {
                            console.log("andito pa din xa...");
                        }
                    });
                }
                

                return nextElementSibling;
            }

            async function getRowData(clickableRow)   {

                await slowDown(3434);

                await scrollToElement(clickableRow);

                clickableRow.click();

                let expandedRow = await getExpandedRow(clickableRow);

                await scrollToElement(expandedRow);

                let productObject = await getData(expandedRow);

                

                productObjects.push(productObject);

                let newRow = await getNextRow(expandedRow, clickableRow);

                console.log({
                    productObject,
                    expandedRow,
                    newRow,
                })

                if(newRow)  {
                    await getRowData(newRow);
                }
            }


            if(tables.length)    {

                await moderator(tables, async (slicedTable) => {
                    
                    let [table] = slicedTable,
                        clickableRow = table.querySelector("tbody tr");
                    
                    await scrollToElement(table);

                    if(clickableRow)    {

                        await getRowData(clickableRow);

                        console.table(productObjects);

                    }

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
                "#content-ui"
            ],
            uriPropName : "productUri",
        }
    ]
}