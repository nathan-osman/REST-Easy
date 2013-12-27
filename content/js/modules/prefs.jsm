/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['getPreference', 'setPreference'];

Components.utils.import('resource://gre/modules/Services.jsm');

/**
 * Returns the value of the specified preference as a string
 * @param [String] name: The name of the preference
 * @param [String] value: The default value for the preference if not set
 * @return [String]: The value of the preference
 */
function getPreference(name, value) {

    try {

        return Services.prefs.getCharPref(name);

    } catch(e) {

        return value;
    }
}

/**
 * Sets the value of the specified preference as a string
 * @param [String] name: The name of the preference
 * @param [String] value: The new value for the preference
 */
function setPreference(name, value) {

    Services.prefs.setCharValue(name, value);
}
