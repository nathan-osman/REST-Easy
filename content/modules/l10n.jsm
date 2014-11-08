/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EXPORTED_SYMBOLS = ['_'];
var LOCALE_URI = 'chrome://resteasy/locale/resteasy.properties';

Components.utils.import('resource://gre/modules/Services.jsm');

// Create a bundle that represents the current locale
var bundle = Services.strings.createBundle(LOCALE_URI);

/**
 * Translates the specified text to the current locale
 * @param [String] text: The text to be translated
 * @return [String]: The translated text
 */
function _(text) {
    return bundle.GetStringFromName(text);
}
