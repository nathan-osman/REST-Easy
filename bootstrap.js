/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var CHROME_URL = 'chrome://resteasy/content/main.html';

function install(data, reason)   {}
function uninstall(data, reason) {}

function startup(data, reason) {

    // Load the required modules for initializing the add-on
    Components.utils.import('chrome://resteasy/content/js/modules/browser.jsm');
    Components.utils.import('chrome://resteasy/content/js/modules/menu.jsm');
    Components.utils.import('chrome://resteasy/content/js/modules/toolbar.jsm');
    Components.utils.import('chrome://resteasy/content/js/modules/watchwindows.jsm');

    // Opens a new tab for REST Easy
    function openRestEasy(window) {

        addTab(window, CHROME_URL);
    }

    // For each open window, create the necessary UI overlays
    watchWindows(function(window) {

        // Add the menu items to the two web developer menus
        addItemToDesktopMenu(window,
                             'appmenu_webDeveloper_popup',
                             'appmenu_resteasy',
                             'REST Easy',
                             openRestEasy);
        addItemToDesktopMenu(window,
                             'menuWebDeveloperPopup',
                             'menu_resteasy',
                             'REST Easy',
                             openRestEasy);

        // Add the menu item to the mobile menu
        addItemToMobileMenu(window,
                            'REST Easy',
                            openRestEasy);

        // Add the item to the toolbar
        addItemToToolbar(window,
                         'launcher',
                         'REST Easy',
                         'chrome://resteasy/content/img/icon16.png',
                         openRestEasy);

        // Hide chrome for this particular location
        hideChromeForLocation(window, CHROME_URL);
    });
}

function shutdown(data, reason) {

    // Load the unload function
    Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

    // Run the unloaders when we're shutting down
    if(reason != APP_SHUTDOWN)
        unload();
}
