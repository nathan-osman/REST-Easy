/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var self = require("sdk/self");
var tabs = require("sdk/tabs");
var { ActionButton } = require("sdk/ui/button/action");
var _ = require("sdk/l10n").get;

// Create the toolbar button used to open the page.
var button = ActionButton({
    id: "resteasy",
    label: _("REST Easy"),
    icon: {
        "16": self.data.url("img/resteasy-16.png"),
        "32": self.data.url("img/resteasy-32.png")
    },
    
    // Open a new tab with REST Easy when clicked.
    onClick: function() {
        tabs.open({
            url: self.data.url("resteasy.html"),
            onReady: function(tab) {
                
                // Attach the translation script.
                var worker = tab.attach({
                    contentScriptFile: self.data.url("js/l10n.js")
                });
                
                // Listen for translation messages.
                worker.port.on("translate", function(id) {
                    worker.port.emit("translation", {
                        id: id,
                        text: _(id)
                    });
                });
            }
        });
    }
});
