/*
 * response.js - Generates content for the response tabs
 * Copyright 2013 - Nathan Osman
 */

function Response(request) {

    var NS_XUL = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';

    // Display the status of the request
    $('#response-headers').append('<h4>Status</h4>')
                          .append($('<p class="status"></p>').text(request.status + ' ' + request.statusText))
                          .append('<br><h4>Headers</h4>');

    // Create the table for displaying headers
    var table = $('<table class="table table-striped"></table>')
        .append('<tr><th>Name</th><th>Value</th></tr>')

    // Split the headers
    var headers = request.getAllResponseHeaders().split('\n');
    $.each(headers, function(i, header) {

        var split = header.indexOf(':');
        if(split !== -1)
            table.append($('<tr></tr>').append($('<td></td>').text(header.substr(0, split)))
                                       .append($('<td></td>').text(header.substr(split + 1))));
    });

    $('#response-headers').append(table);

    // This is far from RFC 2616 compliant but it works for our needs
    var mime     = (request.getResponseHeader('Content-Type') || '').match(/^(.+)\/(.+?)\s*(?:;|$)/) || [null, '', ''],
        type     = mime[1],
        subtype  = mime[2],
        combined = type + '/' + subtype;

    // If the MIME type is invalid, discontinue all further processing
    if(type === '') {
        $('#response-raw').append($('<p class="help-block">Missing or unrecognized Content-Type.</p>'));
        return;
    }

    // Add an indicator to the preview tab
    $('#response-preview').empty().append('<p class="help-block">This content cannot be previewed.</p>');

    // Any MIME type recognized in the list below is highlighted
    var highlight = {
        'application/javascript': 'sh_javascript',
        'application/json':       'sh_javascript',
        'text/html':              'sh_html',
        'text/xml':               'sh_xml'
    };

    // Converts an ArrayBuffer to a string
    function bufferToString(buffer, callback) {

        // Create a blob out of the buffer and a reader
        var blob   = new Blob([buffer]),
            reader = new FileReader();

        // Invoke the callback when the contents have been read
        reader.addEventListener('loadend', function() {
            callback(reader.result);
        });
        reader.readAsText(blob);
    }

    // If the type is in the array above or is text/* then convert
    if(combined in highlight || type === 'text')
        bufferToString(request.response, function(text) {

            // Create a <pre> for the text contents and append it
            var pre = $('<pre></pre>').text(text).appendTo('#response-raw');

            // If we can highlight this type, then prepare to do so
            if(combined in highlight) {

                pre.addClass(highlight[combined]);

                // If the text is larger than 10 KiB, then delay the highlighting
                if(text.length > 10240) {

                    var icon    = $('<span class="glyphicon glyphicon-ok"></span>'),
                        button  = $('<button class="btn btn-default btn-sm pull-right">Highlight Anyway</button>').prepend(icon),
                        warning = $('<div class="alert alert-warning">The response is larger than 10 KiB. ' +
                                    'Syntax highlighting may take a long time.</div>').prepend(button);

                    // Set the click handler for the button and append it to the root element
                    button.click(function() {

                        warning.remove();
                        sh_highlightDocument();
                    });
                    $('#response-raw').prepend(warning);

                } else
                    sh_highlightDocument();
            }

            // If this is an HTML document, then we can create an iframe preview
            if(combined === 'text/html') {

                var iframe = document.createElementNS(NS_XUL, 'iframe');
                iframe.setAttribute('type', 'content');
                $('#response-preview').empty().append(iframe);

                // Insert the HTML
                $(iframe).attr('src', 'data:' + request.getResponseHeader('Content-Type') + ',' +
                                      encodeURIComponent(text)).css('marginBottom', '-5px');
            }
        });

    // Anything else and we are going to have to display a hex dump
    else {

        // Create a Uint8Array that we can use to enumerate the contents
        var data = new Uint8Array(request.response),
            pre  = $('<pre class="break"></pre>');

        // Format each byte and add it
        var hex = '';
        $.each(data, function() {

            var ch = this.toString(16);
            hex += '0x' + ((ch.length === 1)?'0':'') + ch + ' ';
        });

        $('#response-raw').append(pre.append(hex));

        // If it is an image, we can display a preview
        if(type === 'image') {

            // Generate the blob for the image contents
            var blob = URL.createObjectURL(new Blob([request.response]));
            var img  = $('<img>', {
                    'src': blob
                });

            // Append the image and then free the blob
            $('#response-preview').empty().append(img);
            URL.revokeObjectURL(blob);
        }
    }
}
