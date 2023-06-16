const session = require("electron").session;

module.exports = function() {
    session.defaultSession.clearStorageData({ 
        storages: ['cookies', 'indexedDB', 'localStorage'] 
    }, () => {
        console.log('All data cleared');
    });
}
