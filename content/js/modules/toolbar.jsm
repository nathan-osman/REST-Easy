/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['addItemToToolbar'];
var NS_XUL           = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

/**
 * Adds an item to the toolbar
 * @param [node] window: The parent window
 * @param [String] id: The ID of the new toolbar button
 * @param [String] label: The label for the new toolbar item
 * @param [String] icon: The icon to use for the toolbar button
 * @param [function] callback: The callback to be invoked when the toolbar is added
 */
function addItemToToolbar(window, id, label, icon, callback) {

    // Ensure the toolbar and toolbar palette exist
    let toolbar = window.document.getElementById('nav-bar'),
        palette = window.document.getElementById('navigator-toolbox').palette;
    if(toolbar === null || palette == null)
        return;

    // Create the toolbar item
    let toolbarButton = window.document.createElementNS(NS_XUL, 'toolbarbutton'),
        toolbarId = 'resteasy-' + id;
    toolbarButton.setAttribute('id',        toolbarId);
    toolbarButton.setAttribute('class',     'toolbarbutton-1 chromeclass-toolbar-additional');
    toolbarButton.setAttribute('label',     label);
    toolbarButton.setAttribute('removable', 'true');
    toolbarButton.style.listStyleImage = 'url("' + icon + '")';
    toolbarButton.addEventListener('command', function() {

        callback(window);

    }, true);

    // Add the toolbar to the palette
    palette.appendChild(toolbarButton);

    // Have the button remove itself from its parent when unloading
    unload(function() {

        toolbarButton.parentNode.removeChild(toolbarButton);
    });

    // Check to see if the button has been added to the toolbar
    let currentSet = toolbar.getAttribute('currentset').split(','),
        index = currentSet.indexOf(toolbarId);
    if(index == -1) {

        // Determine if this is the first time the button is being added
        let pref = 'extensions.resteasy.toolbar.' + id,
            firstTime = !Services.prefs.prefHasUserValue(pref);

        if(firstTime) {

            toolbar.appendChild(toolbarButton);
            toolbar.setAttribute('currentset', toolbar.currentSet);
            window.document.persist(toolbar.id, 'currentset');

            // This is no longer the first time
            Services.prefs.setBoolPref(pref, true);
        }
    } else {

        // Determine where to insert the button and insert it
        let before = null;
        for(let i = index + 1; i < currentSet.length; ++i)
            if((before = window.document.getElementById(currentSet[i])))
                break;
        toolbar.insertBefore(toolbarButton, before);
    }
}
