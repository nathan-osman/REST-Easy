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
