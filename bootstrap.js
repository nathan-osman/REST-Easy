/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
    LOCALE_URI = 'chrome://resteasy/locale/resteasy.properties',
    CHROME_URI = 'chrome://resteasy/content/resteasy.html',
    ICON16_URI = 'chrome://resteasy/content/img/icon16.png',
    ICON32_URI = 'chrome://resteasy/content/img/icon32.png',
    BUTTON_ID = 'resteasy';

// Currently, there are no tasks that need to be run exclusively at
// (un)installation time, so these have empty function bodies
function install(data, reason) {}
function uninstall(data, reason) {}

// This method is run each time the add-on is initialized
function startup(data, reason) {

    // Create a string bundle representing the current locale
    Components.utils.import('resource://gre/modules/Services.jsm');
    let bundle = Services.strings.createBundle(LOCALE_URI);

    // Register the toolbar button
    Components.utils.import("resource:///modules/CustomizableUI.jsm");
    CustomizableUI.createWidget({
        id: BUTTON_ID,
        type: 'custom',
        defaultArea: CustomizableUI.AREA_NAVBAR,
        onBuild: function(document) {

            // Create the toolbar button
            let toolbarButton = document.createElementNS(NS_XUL, 'toolbarbutton');
            toolbarButton.setAttribute('id', BUTTON_ID);
            toolbarButton.setAttribute('class', 'toolbarbutton-1 chromeclass-toolbar-additional');
            toolbarButton.setAttribute('label', bundle.GetStringFromName('application.title'));
            toolbarButton.setAttribute('tooltiptext', bundle.GetStringFromName('application.tooltip'));
            toolbarButton.addEventListener('command', function(event) {
                event.view.gBrowser.selectedTab = event.view.gBrowser.addTab(CHROME_URI);
            }, true);

            // Set the currently displayed icon based on the widget placement
            function setIcon() {
                let inToolbar = false,
                    placement = CustomizableUI.getPlacementOfWidget(BUTTON_ID);
                if(placement)
                    inToolbar = CustomizableUI.getAreaType(placement.area) === CustomizableUI.TYPE_TOOLBAR;
                toolbarButton.setAttribute('image', inToolbar ? ICON16_URI : ICON32_URI);
            }
            setIcon();

            // Change the icon if it is added to a toolbar or removed
            CustomizableUI.addListener({
                onWidgetAfterDOMChange: function(node, nextNode, container) {
                    if(node.id === BUTTON_ID)
                        setIcon();
                }
            });

            return toolbarButton;
        }
    });
}

function shutdown(data, reason) {

    // Remove the widget
    Components.utils.import("resource:///modules/CustomizableUI.jsm");
    CustomizableUI.destroyWidget(BUTTON_ID);
}
