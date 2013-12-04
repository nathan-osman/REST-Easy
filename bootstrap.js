var NS_XUL     = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
    chrome_url = 'chrome://resteasy/content/main.html';

function startup(data, reason) {

    // Load the watchWindows function
    Components.utils.import('chrome://resteasy/content/js/modules/watchwindows.jsm');

    // Register our item in the web developer menus
    watchWindows(function(window) {

        // Creates the menu item with the provided prefix in the provided menu
        function createDesktopMenuItem(menu, prefix) {

            var separator = window.document.createElementNS(NS_XUL, 'menuseparator'),
                 menuItem = window.document.createElementNS(NS_XUL, 'menuitem');
            menuItem.setAttribute('id',        prefix + '_resteasy');
            menuItem.setAttribute('label',     'REST Easy');
            menuItem.setAttribute('accesskey', 'R');
            menuItem.addEventListener('command', function() {

                // Open the main.html page in a new tab
                window.gBrowser.selectedTab = window.gBrowser.addTab(chrome_url);

            }, true);

            // First append a separator, then the menu item
            menu.appendChild(separator);
            menu.appendChild(menuItem);

            // Register it for removal
            unload(function() {

                menu.removeChild(separator);
                menu.removeChild(menuItem);
            });
        }

        // Check if we are mobile
        if(typeof window.NativeWindow != 'undefined') {

            // Add the item to the native menu
            var menu_resteasy = window.NativeWindow.menu.add("REST Easy", null, function() {

                window.BrowserApp.addTab(chrome_url)
            });

            // Remove the item when the addon is unloaded
            unload(function() {

                window.NativeWindow.menu.remove(menu_resteasy);
            });

        } else {

            // Add it to the appropriate menus
            var appmenu = window.document.getElementById('appmenu_webDeveloper_popup'),
                menu    = window.document.getElementById('menuWebDeveloperPopup');

            if(appmenu !== null)
                createDesktopMenuItem(appmenu, 'appmenu');
            createDesktopMenuItem(menu, 'menu');

            // Hide Chrome for the URL
            var prev = window.XULBrowserWindow.hideChromeForLocation;
            window.XULBrowserWindow.hideChromeForLocation = function(aLocation) {

                return chrome_url == aLocation.substring(0, chrome_url.length) ||
                       prev.apply(window.XULBrowserWindow, [aLocation]);
            };

            // Remove the item from the list
            unload(function() {

                window.XULBrowserWindow.hideChromeForLocation = prev;
            });
        }
    });
}

function shutdown(data, reason) {

    // Clean up with unloaders when we're deactivating
    if (reason != APP_SHUTDOWN)
        unload();
}
