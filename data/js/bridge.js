/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Page content is trusted since it is bundled with the add-on.
var $ = unsafeWindow.$;

// Maps used for storing translations and elements pending translation.
var translations = {};
var elements = {};

// jQuery utility method that retrieves the translation for the provided
// text string and invokes the callback with the translation.
$.translate = function(id, callback) {
    
    if(id in translations)
        callback(translations[id]);
    else {
        if(id in elements)
            elements[id].push(callback);
        else {
            elements[id] = [callback];
            self.port.emit('translate', id);
        }
    }
};

// jQuery selector method that retrieves the translation for the selection
// and appends the translation to the text of the element upon completion.
$.fn.translate = function(id) {
    
    var selection = this;
    $.translate(id, function(text) {
        selection.append(text);
    })
    
    return this;
};

// Listen for translation messages.
self.port.on('translation', function(data) {
    
    // Invoke all of the callbacks.
    $.each(elements[data.id], function() {
        this(data.text);
    });
    
    // Store the translation for later retrieval.
    translations[data.id] = data.text;
});

// jQuery utility method to make a privileged AJAX request.
$.request = function(data) {
    
    self.port.emit('request', data);
};

// Invoke $.response when the response arrives.
self.port.on('response', function(data) {
    
    $.response(data);
});
