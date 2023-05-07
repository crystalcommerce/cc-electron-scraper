const electronApp = require("./core/electron");
const path = require("path");
const { spawnOnChildProcess, createNodeModule } = require("./utilities");

serverProcess = spawnOnChildProcess(path.join(__dirname, "core", "server"));

electronApp(serverProcess);