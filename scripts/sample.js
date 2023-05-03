const { ipcRenderer } = require("electron");

window.addEventListener("load", (e) => {
    
    // let button = document.createElement("button");
    // button.type = "button";
    // button.textContent = "Open Dev Tools";
    // button.id = "cc-button";
    
    // button.style.zIndex = "9999";
    // button.style.position = "fixed";
    // button.style.top =  "100px";
    // button.style.top = "100px";

    // document.body.prepend(button);

    // console.log(ipcRenderer);

    // button.addEventListener("click", (e) => {
    //     ipcRenderer.send("renderer-button-click", {
    //         message : "Hello there, Michael Norward",
    //         from : window.location.href,
    //     });
    // });

    // alert("Michael Norward");

    // let modalMask = document.createElement("div");
    // modalMask.style.zIndex = "77777777777777777777777777777";
    // modalMask.style.position = "absolute";
    // document.querySelector("html").style.position = "relative";
    // modalMask.style.top = "0";
    // modalMask.style.left = "0";
    // modalMask.style.height = document.body.offsetHeight + "px";
    // modalMask.style.width = document.body.offsetWidth + "px";
    // modalMask.style.backgroundColor = "#000000ab";
    // document.body.append(modalMask);

    // ipcRenderer.send("frame-window-id", {message : "currently getting the frame window id"});

    // ipcRenderer.on("frame-window-id", (e, data) => {
    //     document.body.innerHTML = `Frame Window ID : ${data}`;
    // });
    console.log("\n\n\n\n");
    console.log({
        Application : "ElectronJS Scraper Desktop Application",
        Browser : "Chromium Browser",
        message : "This window is controlled by Michael Norward..."
    });
    console.log("\n\n\n\n");

    
});



