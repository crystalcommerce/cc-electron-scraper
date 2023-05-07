const zipper = require("zip-local");

async function fileZipper(targetPath, destinationPath)    {

    let error = null;

    try {
            // zipping a file
        let zipResult = await new Promise((resolve, reject) => {
            zipper.zip(targetPath, function(error, zipped) {
                if(!error) {
                    zipped.compress(); // compress before exporting
            
                    let buff = zipped.memory(); // get the zipped file as a Buffer
            
                    // or save the zipped file to disk
                    zipped.save(destinationPath, function(error) {
                        if(!error) {
                            resolve({
                                statusOk : true, 
                                message : `We have successfully zipped the file.`
                            })
                        }
                    });
                } else  {
                    reject({
                        statusOk : false,
                        message : error.message,
                    })
                }
            });
        })

        return zipResult;

    } catch(err)    {

        return error ? error : { statusOk : false, message : err.message };

    }

}

module.exports = fileZipper;