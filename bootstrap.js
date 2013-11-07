var NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

function startup(data, reason) {
    
    // Load the watchWindows function
    Components.utils.import('chrome://resteasy/content/js/modules/watchwindows.jsm');
    
    // Register our item in the tools menu
    watchWindows(function(window) {
        
        // Create the menu item
        var menuItem = window.document.createElementNS(NS_XUL, 'menuitem');
        menuItem.setAttribute('id',        'resteasy');
        menuItem.setAttribute('label',     'REST Easy');
        menuItem.setAttribute('accesskey', 'R');
        menuItem.addEventListener('command', function() {
            
            // Open the main.html page in a new tab
            var tab = window.document.getElementById('content').addTab('chrome://resteasy/content/main.html');
            tab.parentElement.selectedItem = tab;
            
        }, true);
        
        // Add it to the toolbar
        window.document.getElementById('menu_ToolsPopup').appendChild(menuItem);
        
        // Remember to remove the menu item when the addon is unloaded
        unload(function() {
            
            window.document.getElementById('menu_ToolsPopup').removeChild(menuItem);
        });
    });
}

function shutdown(data, reason) {
    
    // Clean up with unloaders when we're deactivating
    if (reason != APP_SHUTDOWN)
        unload();
}
