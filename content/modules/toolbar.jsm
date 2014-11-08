/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['addButtonToToolbar'];
var NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

Components.utils.import("resource:///modules/CustomizableUI.jsm");
Components.utils.import('chrome://resteasy/content/modules/unload.jsm');

/**
 * Adds a button to the toolbar.
 *
 * This used to be a rather complicated function that had to inject the button
 * into the toolbar of each window individually. Now, thanks to Australis, this
 * is no longer the case. Something finally gets easier for once!
 *
 * @param [String] id: ID for the toolbar button
 * @param [String] label: a short label for the button
 * @param [String] tooltip: longer text describing the button
 * @param [String] icon18: URL of an 16x16 icon to display in the widget
 * @param [String] icon32: URL of a 32x32 icon to display in the widget
 * @param [function] callback: function to be invoked when the button is clicked
 */
function addButtonToToolbar(id, label, tooltip, icon16, icon32, callback) {

    // Create the widget that will be added to the toolbar
    let widget = CustomizableUI.createWidget({
        id: id,
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(document) {

            // Create the toolbar button
            let toolbarButton = document.createElementNS(NS_XUL, 'toolbarbutton');
            toolbarButton.setAttribute('id', id);
            toolbarButton.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
            toolbarButton.setAttribute('label', label);
            toolbarButton.setAttribute('tooltiptext', tooltip);
            toolbarButton.addEventListener('command', function(event) {
                callback(event.view);
            }, true);

            // Set the currently displayed icon
            function setIcon() {
                let inToolbar = false,
                    placement = CustomizableUI.getPlacementOfWidget(id);
                if(placement)
                    inToolbar = CustomizableUI.getAreaType(placement.area) === CustomizableUI.TYPE_TOOLBAR;
                toolbarButton.setAttribute('image', inToolbar ? icon16 : icon32);
            }
            setIcon();

            // Change the icon if it is added to a toolbar or removed
            CustomizableUI.addListener({
                onWidgetAfterDOMChange: function(node, nextNode, container) {
                    if(node.id === id)
                        setIcon();
                }
            });

            return toolbarButton;
        }
    });

    // Remove the widget when the add-on is unloaded
    unload(function() {
        CustomizableUI.destroyWidget(id);
    });
}
