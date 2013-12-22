/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['addItemToDesktopMenu', 'addItemToMobileMenu'];
var NS_XUL           = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

/**
 * Adds an item to the specified menu on desktop Firefox
 * @param [node] window: The parent window
 * @param [String] menu_id: The ID of a menu that the item should be added to
 * @param [String] id: The ID of the new menu item
 * @param [String] title: The title of the new menu item
 * @param [function] callback: The callback to be invoked when the menu item is selected
 */
function addItemToDesktopMenu(window, menu_id, id, title, callback) {

    // Ensure the menu exists
    let menu = window.document.getElementById(menu_id);
    if(menu === null)
        return;

    // Create the separator and menu item that will be appended to the menu
    let separator = window.document.createElementNS(NS_XUL, 'menuseparator'),
         menuItem = window.document.createElementNS(NS_XUL, 'menuitem');

    // Set up the menu item
    menuItem.setAttribute('id', id);
    menuItem.setAttribute('label', title);
    menuItem.addEventListener('command', function() {

        callback(window);

    }, true);

    // Add the separator and menu item to the menu
    menu.appendChild(separator);
    menu.appendChild(menuItem);

    // The separator and menu item should be removed when unloaded
    unload(function() {

        menu.removeChild(separator);
        menu.removeChild(menuItem);
    });
}

/**
 * Adds an item to the menu on Firefox Mobile
 * @param [node] window: The parent window
 * @param [String] title: The title of the new menu item
 * @param [function] callback: The callback to be invoked when the menu item is selected
 */
function addItemToMobileMenu(window, title, callback) {

    // Only attempt to add the menu item if we are on Firefox mobile
    if(typeof window.NativeWindow == 'undefined')
        return;

    // Add the item to the menu and set it for removal when unloaded
    let menuItem = window.NativeWindow.menu.add(title, null, function() {

        callback(window);
    });
    unload(function() {

        window.NativeWindow.menu.remove(menuItem);
    });
}
