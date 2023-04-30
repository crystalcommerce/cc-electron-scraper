const { Menu, MenuItem } = require('electron');


module.exports = function() {

    const template = [
        {
            label: 'Edit',
            submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { label: 'Reload', accelerator: 'CmdOrCtrl+Shift+R', click: () => mainWindow.reloadIgnoringCache() },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectall' }
            ]
        }
    ]

    if (process.platform === 'darwin') {
        template.unshift({
            label: 'MyApp',
            submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
            ]
        })

        // Edit menu.
        template[1].submenu.push(
            { type: 'separator' },
            { label: 'Speech', submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
            ]}
        )

        // Window menu.
        template[3].submenu = [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' }
        ]
    }

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // Unbind Ctrl+R, Ctrl+Shift+R, and F5 for window reload
    const editMenu = Menu.getApplicationMenu().getMenuItemById('edit')
    if (editMenu) {
        const reloadMenuItem = editMenu.submenu.getMenuItemById('reload')
        if (reloadMenuItem) {
            reloadMenuItem.accelerator = ''
        } else {
            // console.error("Reload submenu item not found")
        }
    } else {
        // console.error("Edit menu item not found")
    }

    // Replace Ctrl+R, Ctrl+Shift+R, and F5 for window reload
    // const editMenu = Menu.getApplicationMenu().getMenuItemById('edit')
    // if (editMenu) {
    //     const reloadMenuItem = editMenu.submenu.getMenuItemById('reload')
    // if (reloadMenuItem) {
    //     reloadMenuItem.click = () => myCustomReload()
    // } else {
    //     console.error("Reload submenu item not found")
    // }
    // } else {
    //     console.error("Edit menu item not found")
    // }

    // function myCustomReload() {
    // // Replace with your custom reload logic here
    //     console.log("Reloading the window using my custom function!")
    //     mainWindow.reloadIgnoringCache();
    // }


}

