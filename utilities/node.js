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

module.exports = {
    registerWindowEvent,
}