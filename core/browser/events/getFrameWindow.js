const createFrameWindow = require("../api/create-frame-window");
const AppWindow = require("../classes/app-window");
const FrameWindow = require("../classes/frame-window");

const getFrameWindow = (e, data) => {

    let frameWindow = FrameWindow.windowObjects.find(item => item.parentWindowId === data.parentWindowId && item.windowId === data.windowId),
        messageData = null;

    try {

        if(!data)   {
            throw Error("No data");
        }

        if(frameWindow) {

            frameWindow.isHidden = data.isHidden;
            frameWindow.setWindowOptions(data.browserFrameDimensions);
            frameWindow.setViewedFrame(true);



            messageData = {
                windowId : frameWindow.windowId,
                statusOk : true,
                message : "Frame Window was updated..."
            }

        } else  {

            let parentWindowObject = AppWindow.windowObjects.find(item => item.windowId === data.parentWindowId);

            if(!parentWindowObject)  {
                throw Error("No Parent Window Object");
            }

            frameWindow = createFrameWindow(parentWindowObject, data.windowId, data.browserFrameDimensions);

            messageData = {
                windowId : frameWindow.windowId,
                statusOk : true,
                message : "Frame Window was created..."
            }

        }

        e.sender.send("frame-window-details", messageData);

    } catch(err)    {

        messageData = {
            statusOk : false,
            message : err.message,
        }
    }

    e.sender.send("frame-window-details", messageData);
    
}

module.exports = getFrameWindow;