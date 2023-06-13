/* 

    Application flow process:

        App starts

        checks if user is logged in or not;

        app then updates the files; the files are 

            built-in-files:
                models :
                    user:
                    dynamic-files:

                routes : 
                    user:
                    dynamic-files:

                controllers:
                    user:
                    dynamic-files:

            dynamic-files:
                routes
                models
                controllers
                
                scripts:

        ********************************************************
        ********************************************************

            does the application need its own server?

                for fetching the dynamic files and writing them; 

                    - why do we need to write them instead of just hosing them on github and updating them;
                        
                        - we will need to upload script files that are supposed to be or inserted on certain websites; and
                        we won't have to update each and everytime a new script is uploaded to the server;
                        we will want to have a script that can be updated everytime, without having to update the core files of the applicaiton itself

                for starting the applicaion's own restful api;

                    this way, we won't have to rely on a server, for api, although a server that have the same api will be better;

                for using google's vision api

        ********************************************************
        ********************************************************

        app then restarts to get/include the files that are needed by the application;

        app then launches with the updated files;

        app can then start scraping;


    Application features:

        data scraping:

        script injection:

        api fetching:

        internet browsing with its built in browser;

        messaging:

    
    
    // this is already implemented

    // we need to write the dynamic routes,
    // we also need to write the dynamic models
    // we also need to write the dynamic script






    // user initializes either of the three types of scraping

        categorizedSets
        multiProductsSet
        singeProductScraping
    



    TODO:   Make sure to put all scraping methods in the single product-scrapers... and just use minimal scraped data from the product set scraper


    scenario 1:
        user initiates scraping;

        wants to scrape a set of products;

        scraper scrapes categorized sets to show the sets of products;
        then sends it back to the renderer...

        user then selects the products set/sets

        scraper starts scraping

    scenario 2:
        user wants to scrape selected products from url;
        user enters the urls of the products he wants to scrape...

        scraper then starts scraping the products and sends it back to the renderer...

    
    scenario 3:

        user wants to scrape the entirety of the website
        scraper gets all the categorized sets and sends it back to the renderer
        scraper continues scraping all products per product set;
        scraper then shows details of scraping...


*/
