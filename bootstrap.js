/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var CHROME_URL = 'chrome://resteasy/content/resteasy.html';

function install(data, reason) {}
function uninstall(data, reason) {}

function startup(data, reason) {

    // Load the required modules for initializing the add-on
    Components.utils.import('chrome://resteasy/content/modules/l10n.jsm');
    Components.utils.import('chrome://resteasy/content/modules/toolbar.jsm');

    // Add the primary button to the toolbar
    addButtonToToolbar(
        'resteasy',
        _('ui.title'),
        _('ui.tooltip'),
        'chrome://resteasy/content/img/icon16.png',
        'chrome://resteasy/content/img/icon32.png',
        function(window) {
            window.gBrowser.selectedTab = window.gBrowser.addTab(CHROME_URL);
        }
    );
}

function shutdown(data, reason) {

    // Load the unload function
    Components.utils.import('chrome://resteasy/content/modules/unload.jsm');

    // Run the unloaders when we're shutting down
    if(reason != APP_SHUTDOWN)
        unload();
}
