/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['addItemToToolbar'];
var NS_XUL           = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

/**
 * Adds an item to the toolbar
 * @param [node] window: The parent window
 * @param [String] label: The label for the new toolbar item
 * @param [function] callback: The callback to be invoked when the toolbar is added
 */
function addItemToToolbar(window, label, callback) {

    // Ensure the toolbar exists
    let toolbar = window.document.getElementById('nav-bar');
    if(toolbar === null)
        return;

    // Create the toolbar item
    let toolbarButton = window.document.createElementNS(NS_XUL, 'toolbarbutton');
    toolbarButton.setAttribute('id',        'resteasy-tbb');
    toolbarButton.setAttribute('class',     'toolbarbutton-1 chromeclass-toolbar-additional');
    toolbarButton.setAttribute('label',     label);
    toolbarButton.addEventListener('command', function() {

        callback(window);

    }, true);

    // Add the toolbar item to the toolbar
    toolbar.appendChild(toolbarButton);

    // The toolbar should be removed when unloaded
    unload(function() {

        toolbar.removeChild(toolbarButton);
    });
}
