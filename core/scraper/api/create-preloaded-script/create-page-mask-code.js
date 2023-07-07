module.exports = function(serverUrl) {
    
    let codeOutput = "";

    codeOutput += `let containerMask = document.createElement("div"),\n`;
    codeOutput += `\tmodalContainer = document.createElement("div"),\n`;
    codeOutput += `\tmodalContainerHeader = document.createElement("header"),\n`;
    codeOutput += `\tmodalContainerBody = document.createElement("main"),\n`;
    codeOutput += `\timage = document.createElement("img"),\n`;
    codeOutput += `\theaderTextContainer = document.createElement("h1"),\n`,
    codeOutput += `\tserverUrl = "${serverUrl}",\n`,
    codeOutput += `\timageUrl = serverUrl + "/media/images/logo-512x512-transparent.png";\n`,
    codeOutput += `\n`;
    
    codeOutput += `// containerMask styles\n`;
    codeOutput += `containerMask.className = 'cc-scraper-window-container-mask';\n`;
    codeOutput += `containerMask.style.position = 'fixed';\n`;
    codeOutput += `containerMask.style.top = '0';\n`;
    codeOutput += `containerMask.style.bottom = '0';\n`;
    codeOutput += `containerMask.style.left = '0';\n`;
    codeOutput += `containerMask.style.right = '0';\n`;
    codeOutput += `containerMask.style.height = '100vh';\n`;
    codeOutput += `containerMask.style.width = '100%';\n`;
    codeOutput += `containerMask.style.display = 'flex';\n`;
    codeOutput += `containerMask.style.justifyContent = 'center';\n`;
    codeOutput += `containerMask.style.alignItems = 'center';\n`;
    codeOutput += `containerMask.style.backgroundColor = '#0f2523cc';\n`;
    codeOutput += `containerMask.style.zIndex = '7777747';\n`;
    codeOutput += `containerMask.style.padding = '1.5rem';\n`;

    codeOutput += `containerMask.append(modalContainer);\n`;
    codeOutput += `\n`;

    codeOutput += `// modalContainer styles\n`;
    codeOutput += `modalContainer.className = 'cc-scraper-window-modal-container';\n`;
    codeOutput += `modalContainer.style.height = 'auto';\n`;
    codeOutput += `modalContainer.style.maxHeight = '95vh';\n`;
    codeOutput += `modalContainer.style.minWidth = '500px';\n`;
    codeOutput += `modalContainer.style.maxWidth = '95%';\n`;
    codeOutput += `modalContainer.style.width = 'auto';\n`;
    codeOutput += `modalContainer.style.color = 'white';\n`;
    codeOutput += `modalContainer.style.overflowY = 'auto';\n`;
    codeOutput += `modalContainer.style.pointerEvents = 'none';\n`;
    codeOutput += `modalContainer.style.backgroundColor = '#2f8a97bf';\n`;
    codeOutput += `modalContainer.append(modalContainerHeader);\n`;
    codeOutput += `modalContainer.append(modalContainerBody);\n`;
    codeOutput += `\n`;

    codeOutput += `// modalContainerHeader styles\n`;
    codeOutput += `modalContainerHeader.style.display = 'flex';\n`;
    codeOutput += `modalContainerHeader.style.height = 'auto';\n`;
    codeOutput += `modalContainerHeader.style.flexDirection = 'row';\n`;
    codeOutput += `modalContainerHeader.style.gap = '.5rem';\n`;
    codeOutput += `modalContainerHeader.style.alignItems = 'center';\n`;
    codeOutput += `modalContainerHeader.style.justifyContent = 'center';\n`;
    codeOutput += `modalContainerHeader.style.padding = '.5rem 1.5rem';\n`;
    
    codeOutput += `modalContainerHeader.append(image);\n`;
    codeOutput += `modalContainerHeader.append(headerTextContainer);\n`;
    codeOutput += `\n`;

    codeOutput += `// image styles\n`;
    codeOutput += `image.style.height = '75px';\n`;
    codeOutput += `image.style.width = '75px';\n`;
    codeOutput += `image.src = imageUrl;\n`;
    codeOutput += `\n`;

    codeOutput += `// headerTextContainer styles\n`;
    codeOutput += `headerTextContainer.innerHTML = 'This window is programmatically controlled for scraping';\n`;
    codeOutput += `headerTextContainer.style.fontSize = '1.2rem';\n`;
    codeOutput += `headerTextContainer.style.padding = '.5rem';\n`;
    codeOutput += `headerTextContainer.style.lineHeight = '1.34';\n`;
    codeOutput += `headerTextContainer.style.color = 'white';\n`;
    codeOutput += `\n`;

    codeOutput += `// modalContainerBody styles\n`;
    codeOutput += `modalContainerBody.innerHTML = '<p style="text-align: left; line-height: 1.4;">Page navigation through links or urls are disabled to prevent any error occuring while the script is scraping this page.</p>';\n`;
    codeOutput += `modalContainerBody.style.display = 'flex';\n`;
    codeOutput += `modalContainerBody.style.flexDirection = 'column';\n`;
    codeOutput += `modalContainerBody.style.alignItems = 'center';\n`;
    codeOutput += `modalContainerBody.style.justifyContent = 'center';\n`;
    codeOutput += `modalContainerBody.style.padding = '0 1.5rem 1.5rem';\n`;
    codeOutput += `modalContainerBody.style.lineHeight = '1.4';\n`;
    codeOutput += `modalContainerBody.style.color = '#c5c5c5';\n`;
    codeOutput += `\n`;

    
    codeOutput += `window.addEventListener("DOMContentLoaded", (e) => {\n`;
    codeOutput += `\tdocument.body.prepend(containerMask);\n`;
    codeOutput += `});\n`;
    
    codeOutput += `\n`;



    return codeOutput;

}