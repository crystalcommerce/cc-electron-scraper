const {startElectronApp, app} = require("./electron");
const path = require("path");
const { spawnOnChildProcess } = require("./utilities");


const initializeModulesWriter = (callback) => {
    /* This is just a simulation of the file writing process that will occur before the application starts. */
    let userDataPath = app.getPath("userData"),
        appAbsPath = app.getAppPath(),
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
            console.log("Models, Routes and Script modules have been created.");

            initialServerProcess.kill();

            callback({userDataPath, appAbsPath});

        }
    });

}

const initializeApp = ({userDataPath, appAbsPath}) => {

    // this is the part that creates the electron app;

    let serverProcess = spawnOnChildProcess(path.join(__dirname, "server", "index.js"));

    // we are only sending the modules to the server application;

    serverProcess.send({type : "app-data-dir-path", payload : userDataPath});

    // console.log(serverProcess.send);

    serverProcess.on("message", (data) => {

        if(data.message === "server-has-initialized") {

            startElectronApp({serverProcess, appAbsPath, userDataPath, serverUrl : data.payload});

        }

    });

}


initializeModulesWriter(({userDataPath, appAbsPath}) => {

    initializeApp({userDataPath, appAbsPath});

});