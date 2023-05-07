function addFailedResponseHeaders(status) {
    if(status > 299 && status < 200)  {
        global.failedResponse += 1;
    }
}

async function saveCurrentState(callback)   {

    if(global.failedResponse >= 50)  {
        await callback();

        setTimeout(() =>  process.exit(), 5000);
    }

}

module.exports = { addFailedResponseHeaders, saveCurrentState }