const CcBrowserWindow = require("../classes/cc-browser-window");
const FrameWindowComponent = require("../classes/frame-window-component");

const setFrameWindow = (e, data) => {

    let messageData = null;

    try {

        if(!data)   {
            throw Error("No data");
        }

            
        FrameWindowComponent.addFrameObject(data);

        messageData = {
            statusOk : true,
            message : "Frame Window was updated...",
            payload : {
                ...data,
                frameWindowActive : true,
            },

        }

        /* We have to set the active browser window's window options here... */
        let activeBrowserWindow = CcBrowserWindow.windowObjects.find(item => item.parentWindowId === data.AppWindowId && item.componentId === data.componentId && !item.isHidden);

        if(activeBrowserWindow) {

            activeBrowserWindow.setWindowDimensions();
            activeBrowserWindow.showWindow();

            CcBrowserWindow.hideAllBrowserWindows(activeBrowserWindow.parentWindowId);
            CcBrowserWindow.verifyHiddenBrowsers(activeBrowserWindow.parentWindowId, () => {

                activeBrowserWindow.setWindowDimensions();
                activeBrowserWindow.showWindow();
                
                messageData = {
                    statusOk : true,
                    message : "Frame Window was updated...",
                    payload : data,
        
                }
                
                e.sender.send("frame-window-component-details", messageData);

                return;

            });
            
        }
        
    } catch(err)    {

        console.log(err);
        messageData = {
            statusOk : false,
            message : err.message,
            payload : {
                ...data,
            }
        }

        
    }


    e.sender.send("frame-window-component-details", messageData);
    
}

module.exports = setFrameWindow;