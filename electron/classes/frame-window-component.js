// const CcBrowserWindow = require("./cc-browser-window");

class FrameWindowComponent {

    static componentObjects = [];

    static getFrameWindowComponent(AppWindowId, componentId)    {
        return FrameWindowComponent.componentObjects.find(item => item.AppWindowId === AppWindowId && item.componentId === componentId);
    }

    static addFrameObject(frameWindowComponent) {
        let foundFrameComponentObject = FrameWindowComponent.getFrameWindowComponent(frameWindowComponent.AppWindowId, frameWindowComponent.componentId)

        if(!foundFrameComponentObject)  {
            FrameWindowComponent.componentObjects.push(frameWindowComponent);
        } else  {
            Object.assign(foundFrameComponentObject, frameWindowComponent);
        }

    }

    static removeFrameObject(frameWindowComponent) {
        FrameWindowComponent.componentObjects = FrameWindowComponent.componentObjects.filter(item => item.AppWindowId !== frameWindowComponent.AppWindowId && item.componentId !== frameWindowComponent.componentId);
    }

    static hideAllFrameComponentObjects(AppWindowId)   {
        FrameWindowComponent.componentObjects.forEach(item => {
            if(item.AppWindowId === AppWindowId)    {
                item.dimensions = {width : 0, height : 0, x : 0, y : 0};
            }
        });
    }

    static removeAllComponentObjects(AppWindowId, callback = () => {})  {
        
        FrameWindowComponent.hideAllFrameComponentObjects(AppWindowId);

        FrameWindowComponent.componentObjects = FrameWindowComponent.componentObjects.filter(item => item.AppWindowId === AppWindowId);
        callback();

    }

}
    
module.exports = FrameWindowComponent;