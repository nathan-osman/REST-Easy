/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Restartless.
 *
 * The Initial Developer of the Original Code is The Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Edward Lee <edilee@mozilla.com>
 * Nathan Osman <admin@quickmediasolutions.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var EXPORTED_SYMBOLS = ['watchWindows'];

Components.utils.import('resource://gre/modules/Services.jsm');
Components.utils.import('chrome://resteasy/content/js/modules/unload.jsm');

/**
 * Invokes the specified callback for each browser window
 * @param [function] callback: A callback to be invoked for each window
 */
function watchWindows(callback) {

    // This function originally wrapped callback() in a try/catch block
    // to supress errors, but it's more useful if those errors are
    // actually reported rather than silently eaten.
    function watcher(window) {

        // Now that the window has loaded, only handle browser windows
        let {documentElement} = window.document;
        if(documentElement.getAttribute('windowtype') == 'navigator:browser')
            callback(window);
    }

    // Wait for the window to finish loading before running the callback
    function runOnLoad(window) {

        // Listen for one load event before checking the window type
        window.addEventListener('load', function runOnce() {

            window.removeEventListener('load', runOnce, false);
            watcher(window);

        }, false);
    }

    // Add functionality to existing windows
    let windows = Services.wm.getEnumerator(null);
    while(windows.hasMoreElements()) {

        // Only run the watcher immediately if the window is completely loaded
        let window = windows.getNext();
        if(window.document.readyState == 'complete')
            watcher(window);
        // Wait for the window to load before continuing
        else
            runOnLoad(window);
    }

    // Watch for new browser windows opening then wait for it to load
    function windowWatcher(subject, topic) {

        if(topic == 'domwindowopened')
            runOnLoad(subject);
    }

    Services.ww.registerNotification(windowWatcher);

    // Make sure to stop watching for windows if we're unloading
    unload(function() {

        Services.ww.unregisterNotification(windowWatcher);
    });
}
