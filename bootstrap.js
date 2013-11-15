var NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

function startup(data, reason) {
    
    // Load the watchWindows function
    Components.utils.import('chrome://resteasy/content/js/modules/watchwindows.jsm');
    
    // Register our item in the web developer menus
    watchWindows(function(window) {
        
        // Creates and returns the menu item with the provided prefix in the provided menu
        function createMenuItem(menu, prefix) {
            
            var menuItem = window.document.createElementNS(NS_XUL, 'menuitem');
            menuItem.setAttribute('id',        prefix + '_resteasy');
            menuItem.setAttribute('label',     'REST Easy');
            menuItem.setAttribute('accesskey', 'R');
            menuItem.addEventListener('command', function() {
                
                // Open the main.html page in a new tab
                var tab = window.document.getElementById('content').addTab('chrome://resteasy/content/main.html');
                tab.parentElement.selectedItem = tab;
                
            }, true);
            
            // First append a separator, then the menu item
            window.document.getElementById(menu).appendChild(window.document.createElementNS(NS_XUL, 'menuseparator'));
            window.document.getElementById(menu).appendChild(menuItem);
            return menuItem;
        }
        
        // Add it to the toolbar
        var appmenu_resteasy = createMenuItem('appmenu_webDeveloper_popup', 'appmenu');
        var menu_resteasy    = createMenuItem('menuWebDeveloperPopup',      'menu');
        
        // Remember to remove the menu item when the addon is unloaded
        unload(function() {
            
            window.document.getElementById('appmenu_webDeveloper_popup').removeChild(appmenu_resteasy);
            window.document.getElementById('menuWebDeveloperPopup').removeChild(menu_resteasy);
        });
    });
}

function shutdown(data, reason) {
    
    // Clean up with unloaders when we're deactivating
    if (reason != APP_SHUTDOWN)
        unload();
}
