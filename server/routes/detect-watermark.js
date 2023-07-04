const vision = require('@google-cloud/vision');
const fetch = require('node-fetch');
const express = require('express');
const googleIwdFilters = require('../../config/google-iwd-filters'); // contains all the searchTerms that iwd has to use
const {Router} = express;
const router = Router();

// Create a new client instance for Google Cloud Vision API
const client = new vision.ImageAnnotatorClient();


module.exports = function() {
    // Route to handle image analysis
    router.post('/detect-watermark', express.json(), async (req, res) => {
        try {
            // Extract the image URL from the request body
            const imageUrl = req.body.url;

            // Fetch the image using the node-fetch library
            const response = await fetch(imageUrl);
            const buffer = await response.buffer();

            // Analyze the image for labels using Google Cloud Vision API
            const resultsArr = await client.textDetection(buffer);
            const [result] = resultsArr;

            const texts = result.textAnnotations.map((label) => label.description);


            // Check if any of the detected labels match the text of the watermark
            let	foundWatermarkText = null,
                detectedWatermark = texts.find(text => {
                
                    return googleIwdFilters.some(item  => {

                        // console.log({text, item, result : text.toLowerCase().includes(item)});

                        if(text.toLowerCase().includes(item) || text.includes(item))	{
                            foundWatermarkText = item;
                            return true;
                        } else	{
                            return false;
                        }
                    })

                });

            res.json({ success: true, detectedWatermark, hasWatermark : detectedWatermark ? true : false, foundWatermarkText });
        } catch (error) {
            // console.log(error);
            // on error, we'd like the app to notify us about it,

            // in every scan, we also want to log it, somewhere...

            // save the result to database;

            res.json({ success: false, message: 'Error analyzing image' });
        }
    });


    return router;

}

