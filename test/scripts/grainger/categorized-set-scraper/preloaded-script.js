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
		// let results = await Promise.all(promises.map(item => item()));

		// let {queryObject, urlWithoutQueryString} = queryStringToObject(window.location.href),
		// 	currentWait = Number(queryObject.cc_failed_waits) || 0;

		// currentWait++;
		// queryObject.cc_failed_waits = currentWait;

		// let newQueryString = objectToQueryString(queryObject);
		// if(results.some(result => !result)) {
		// 	ipcRenderer.send("cc-scraping-wait-for-selectors-failed", {
		// 		payload : {
		// 			AppWindowId,
		// 			componentId,
		// 			windowId,
		// 			message : "Waiting for html selectors failed.",
		// 			url : urlWithoutQueryString + "?" + newQueryString,
		// 			currentWait,
		// 		}
		// 	});


		// }


		let callback = async (utilityProps, dataProps) => {

            let { scrollToBottom, slowDown, queryStringToObject, objectToQueryString } = utilityProps;

            await scrollToBottom(700);

            // await scrollToTop();

            console.log({
                message : "this works... and this is for the grainger scripts",
                author : "Michael Norward Miranda",
                date : ccPageUtilities.formattedDate(new Date())
            })

            await slowDown(2525);

            let { categoryObject } = dataProps

            function getStartingPointUrl(categoryObject)  {

                let categoryLinks = Array.from(document.querySelectorAll(".-jeeqs > li > a")),
					branchViewList = Array.from(document.querySelectorAll("ul[data-testid^='branch-view-list']  li  a[data-test-id^='branch-item']")),
					newCategorizedSets = [];

                if(!categoryLinks.length && !branchViewList.length)    {

                    return {
                        newCategorizedSets : []
                    };
                    
                } else  {
                    // replace the categoryObject item from the categorizedSetsArr;

					if(categoryLinks.length)	{
						newCategorizedSets = categoryLinks.map(item => {

							// categoryObject.additionalCategoryTags.push(item.title);
	
							let obj =  {
								...categoryObject,
								startingPointUrl : item.href,
								// additionalCategoryTag,
							};
	
							if(obj.setData && !Array.isArray(obj.setData.additionalCategoryTags))  {
								obj.setData.additionalCategoryTags = [];
							}
	
							if(categoryObject.setData && Array.isArray(categoryObject.setData.additionalCategoryTags))  {
								// obj.additionalCategoryTags.push(...categoryObject.additionalCategoryTags);
								for(let categoryTag of categoryObject.setData.additionalCategoryTags)  {
									if(!obj.setData.additionalCategoryTags.includes(categoryTag))  {
										obj.setData.additionalCategoryTags.push(categoryTag);
									}
								}
							}
	
							obj.setData.additionalCategoryTags.push(item.title);
	
							return obj;
	
						});
					} else if(branchViewList.length)	{


						newCategorizedSets = branchViewList.map(item => {

							// categoryObject.additionalCategoryTags.push(item.title);
	
							let obj =  {
								...categoryObject,
								startingPointUrl : item.href,
								// additionalCategoryTag,
							};
	
							if(!Array.isArray(obj.additionalCategoryTags))  {
								obj.additionalCategoryTags = [];
							}
	
							if(Array.isArray(categoryObject.additionalCategoryTags))  {
								// obj.additionalCategoryTags.push(...categoryObject.additionalCategoryTags);
								for(let categoryTag of categoryObject.additionalCategoryTags)  {
									if(!obj.additionalCategoryTags.includes(categoryTag))  {
										obj.additionalCategoryTags.push(categoryTag);
									}
								}
							}
							
							if(item && item.innerText !== "")	{
								obj.additionalCategoryTags.push(item.innerText.trim());
							}
							
							return obj;
	
						});

					}


                    // replaceCategoryObject(categoryObject, categorizedSetsArr, newCategorizedSets);

                    return {
                        newCategorizedSets,
                    };
                }

            }

            return getStartingPointUrl(categoryObject);
            
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


