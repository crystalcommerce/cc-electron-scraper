const ccPageUtilities = require("E:/apps/electron-apps/cc-electron-scraper/utilities");
const { ipcRenderer } = require("electron");
window.ccPageUtilities = ccPageUtilities;



let containerMask = document.createElement("div"),
	modalContainer = document.createElement("div"),
	modalContainerHeader = document.createElement("header"),
	modalContainerBody = document.createElement("main"),
	image = document.createElement("img"),
	headerTextContainer = document.createElement("h1"),
	serverUrl = "http://localhost:7000",
	imageUrl = serverUrl + "/media/images/logo-512x512-transparent.png";

// containerMask styles
containerMask.className = 'cc-scraper-window-container-mask';
containerMask.style.position = 'fixed';
containerMask.style.top = '0';
containerMask.style.bottom = '0';
containerMask.style.left = '0';
containerMask.style.right = '0';
containerMask.style.height = '100vh';
containerMask.style.width = '100%';
containerMask.style.display = 'flex';
containerMask.style.justifyContent = 'center';
containerMask.style.alignItems = 'center';
containerMask.style.backgroundColor = '#0f2523cc';
containerMask.style.zIndex = '7777747';
containerMask.style.padding = '1.5rem';
containerMask.append(modalContainer);

// modalContainer styles
modalContainer.className = 'cc-scraper-window-modal-container';
modalContainer.style.height = 'auto';
modalContainer.style.width = '500px';
modalContainer.style.color = 'white';
modalContainer.style.pointerEvents = 'none';
modalContainer.style.backgroundColor = '#2f8a97bf';
modalContainer.append(modalContainerHeader);
modalContainer.append(modalContainerBody);

// modalContainerHeader styles
modalContainerHeader.style.display = 'flex';
modalContainerHeader.style.height = 'auto';
modalContainerHeader.style.flexDirection = 'row';
modalContainerHeader.style.gap = '.5rem';
modalContainerHeader.style.alignItems = 'center';
modalContainerHeader.style.justifyContent = 'center';
modalContainerHeader.style.padding = '.5rem 1.5rem';
modalContainerHeader.append(image);
modalContainerHeader.append(headerTextContainer);

// image styles
image.style.height = '75px';
image.style.width = '75px';
image.src = imageUrl;

// headerTextContainer styles
headerTextContainer.innerHTML = 'This window is programmatically controlled for scraping';
headerTextContainer.style.fontSize = '1.2rem';
headerTextContainer.style.padding = '.5rem';
headerTextContainer.style.lineHeight = '1.34';
headerTextContainer.style.color = 'white';

// modalContainerBody styles
modalContainerBody.innerHTML = '<p style="text-align: left; line-height: 1.4;">Page navigation through links or urls are disabled to prevent any error occuring while the script is scraping this page.</p>';
modalContainerBody.style.display = 'flex';
modalContainerBody.style.flexDirection = 'column';
modalContainerBody.style.alignItems = 'center';
modalContainerBody.style.justifyContent = 'center';
modalContainerBody.style.padding = '0 1.5rem 1.5rem';
modalContainerBody.style.lineHeight = '1.4';
modalContainerBody.style.color = '#c5c5c5';

window.addEventListener("DOMContentLoaded", (e) => {
	document.body.prepend(containerMask);
});

window.addEventListener("load", (e) => {
	ipcRenderer.send("document-ready", {});
});

(async function(){

	ipcRenderer.once("scraper-window-details", async (e, data) => {
		console.log(data);

		let {ccScraperWindow, ccDataProps} = data;

		window.ccScraperWindow = ccScraperWindow;
		window.ccDataProps = ccDataProps;

		let waitForSelectors = [".plp__products-grid-container"],
		{AppWindowId, componentId, windowId} = window.ccScraperWindow,
			{ waitForSelector, timedReload, slowDown, queryStringToObject, objectToQueryString } = window.ccPageUtilities,
			promises = waitForSelectors.map(selector => {
				return async function(){
					return await waitForSelector(() => document.querySelector(selector));
				};
			});
		let results = await Promise.all(promises.map(item => item()));

		let {queryObject, urlWithoutQueryString} = queryStringToObject(window.location.href),
			currentWait = Number(queryObject.cc_failed_waits) || 0;

		currentWait++;
		queryObject.cc_failed_waits = currentWait;

		let newQueryString = objectToQueryString(queryObject);
		if(results.some(result => !result)) {
			ipcRenderer.send("cc-scraping-wait-for-selectors-failed", {
				payload : {
					AppWindowId,
					componentId,
					windowId,
					message : "Waiting for html selectors failed.",
					url : urlWithoutQueryString + "?" + newQueryString,
					currentWait,
				}
			});


		}


		let callback = async (utilityProps, dataProps) => {

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

        };


		//executing the callback function
		let ccScrapingResult = await callback(window.ccPageUtilities, window.ccDataProps);
		let innerHTML = "<h2 style='font-size : 1.2rem; color : white;'>Scraped Data</h2>";
		innerHTML += "<ul style='font-family : monospace; text-align : left; padding : 1.5rem'>";
		for(let key in ccScrapingResult){
			 innerHTML += "<li><span style='color : #b4ff00; font-weight : bold;'>" + key + "</span> : <span style='color : white'>" + ccScrapingResult[key] + "</span></li>";
		}
		innerHTML += "</ul>";
		modalContainerBody.innerHTML += innerHTML;



		// sending the data back to main process;
		await slowDown(2525);
		ipcRenderer.send("cc-scraping-result", {
			payload : {
				AppWindowId,
				componentId,
				windowId,
				ccScrapingResult,
			}
		});


	});


}());