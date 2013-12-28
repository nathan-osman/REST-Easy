/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['addTab', 'hideChromeForLocation'];

Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

/**
 * Opens a new tab to the specified location
 * @param [node] window: The parent window
 * @param [String] location: The location to open in the new tab
 */
function addTab(window, location) {

    // Invoke the appropriate method depending on whether we are on Firefox mobile or not
    let browser = (window.gBrowser || window.BrowserApp);
    browser.selectedTab = browser.addTab(location);
}

/**
 * Hides the browser chrome when the specified location is opened
 * @param [node] window: The parent window
 * @param [String] location: The location that should have the browser chrome hidden
 */
function hideChromeForLocation(window, location) {

    // Ensure XULBrowserWindow exists
    if(typeof window.XULBrowserWindow == 'undefined')
        return;

    // Store the old callback
    let prev = window.XULBrowserWindow.hideChromeForLocation;

    // Add the new location to the list of locations to be evaluated
    window.XULBrowserWindow.hideChromeForLocation = function(aLocation) {

        return location == aLocation.substring(0, location.length) ||
               prev.call(window.XULBrowserWindow, aLocation);
    };

    // Restore the old callback when unloaded
    unload(function() {

        window.XULBrowserWindow.hideChromeForLocation = prev;
    });
}
