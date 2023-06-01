const {startElectronApp, app} = require("./electron");
const path = require("path");
const { spawnOnChildProcess } = require("./utilities");


const initializeModulesWriter = (callback) => {
    /* This is just a simulation of the file writing process that will occur before the application starts. */
    let userDataPath = app.getPath("userData"),
        initialServerProcess = spawnOnChildProcess(path.join(__dirname, "server", "initializer.js"));

    initialServerProcess.send({
        message : "create-required-modules", 
        payload : {
            targetDirPath : userDataPath
        }
    });

    initialServerProcess.on("message", (data) => {
        if(data.message === "required-modules-created") {

            // console.log({message : "data retrieved in the main process", ...data});

            initialServerProcess.kill();

            callback(userDataPath);

        }
    });

}

const initializeApp = (userDataPath) => {

    // this is the part that creates the electron app;

    let serverProcess = spawnOnChildProcess(path.join(__dirname, "server", "index.js"));

    // we are only sending the modules to the server application;

    serverProcess.send({type : "app-data-dir-path", payload : userDataPath});

    // console.log(serverProcess.send);

    serverProcess.on("message", (data) => {

        if(data.message === "server-has-initialized") {

            startElectronApp(serverProcess, userDataPath, data.payload);

        }

    });

}


initializeModulesWriter((userDataPath) => {

    initializeApp(userDataPath);

});