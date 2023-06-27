const grainger = require("./test/scripts/grainger");
const { app } = require('electron');


(async function(){
    await grainger(app);
}())