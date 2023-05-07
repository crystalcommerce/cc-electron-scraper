const { spawn } = require('child_process');
const vm = require('vm');
const path = require("path");
const fs = require("fs");

function registerWindowEvent(windowId, object, eventName, callback)  {

    if(!Array.isArray(global.eventListenersObject))  {
        global.eventListenersObject = [];
    }

    let foundRegisteredListener = global.eventListenersObject.find(item => item.windowId === windowId && item.eventName === eventName && item.object === object);

    if(!foundRegisteredListener) {
        object.on(eventName, callback);
        global.eventListenersObject.push({
            windowId,
            eventName,
            object,
            callback,
        });
    } 
    
}

function spawnOnChildProcess(filePath)  {
    
    // Replace '/path/to/your/file.js' with the actual file path you want to execute
    const childProcess = spawn('node', [filePath]);

    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    return childProcess;
}

function createNodeModule2(jsModuleCode, filename, requiredModules = {}) {
    const jsModule = {};
    const script = new vm.Script(jsModuleCode, {
        filename,
    });
    const context = new vm.createContext({
        module,
        exports: jsModule,
        require: (moduleName) => {
            if (requiredModules.hasOwnProperty(moduleName)) {
                return requiredModules[moduleName];
            } else {
                return require(moduleName);
            }
        },
        process,
        console,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
    });
  
    script.runInContext(context);
  
    return jsModule.exports;
}

function createNodeModule(jsModuleCode, filename = 'cc-dynamic-module.js') {
    const jsModule = {};
    const script = new vm.Script(jsModuleCode);
    const context = new vm.createContext({
        module,
        exports: jsModule,
        require: (moduleName) => {
            // Resolve the module path relative to the current module
            const modulePath = path.resolve(path.dirname(filename), moduleName);

            // Load the module code and execute it in a new context
            const moduleCode = fs.readFileSync(modulePath, 'utf8');
            const moduleScript = new vm.Script(moduleCode, {
                filename: modulePath,
                displayErrors: true,
            });
            const moduleContext = new vm.createContext({
                module: {},
                exports: {},
                require: (moduleName) => module.require(moduleName),
                process,
                console,
                setTimeout,
                setInterval,
                clearTimeout,
                clearInterval,
            });
            moduleScript.runInContext(moduleContext);

            // Return the exported object from the module
            return moduleContext.exports;
        },
        process,
        console,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
    });

    script.runInContext(context);

    return jsModule.exports;
}


module.exports = {
    registerWindowEvent,
    spawnOnChildProcess,
    createNodeModule,
    createNodeModule2,
}