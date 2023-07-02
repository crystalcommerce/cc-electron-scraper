
module.exports = function({ipcMain, appAbsPath, userDataPath, serverUrl, appObject})   {

    // create scraper window
    // close scraper window;

    /* 
        this will probably have to be inside the child process module... 'cause the process listed here is the actual child process and not the parent process 
    */
    process.on("message", (e, data) => {
        
    });

    // initializing categorized-sets-scraper
    ipcMain.on("initialize-categorized-sets-scraping", (e, data) => {
        // data.payload
        // pass it to the function
    });

    // initializing products-set-scraper
    ipcMain.on("initialize-multi-products-sets-scraping", (e, data) => {

    });


    // initializing single-product-scraper
    ipcMain.on("initialize-multi-single-product-scraping", (e, data) => {
        
    });

    // set active scraper window - toggle between shown or hidden;
    ipcMain.on("set-active-scraper-window", (e, data) => {
        
    });

    // hiding scraper windows on page navigation;
    ipcMain.on("hide-all-scraper-windows", (e, data) => {
        
    });

    // opening and closing scraper window devtools;
    ipcMain.on("toggle-scraper-window-dev-tools", (e, data) => {
        
    });

    // closing or cancelling the scraping process;
    ipcMain.on("pause-scraping-process", (e, data) => {
        
    });

    // closing or cancelling the scraping process;
    ipcMain.on("stop-scraping-process", (e, data) => {
        
    });

    ipcMain.on("scraper-window-log", (e, data) => {
        console.log(data);
    });

}