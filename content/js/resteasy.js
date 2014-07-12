/*
 * resteasy.js - Interactivity for the REST Easy addon
 * Copyright 2013 - Nathan Osman
 */

function RestEasy() {

    // Begin by initializing the UI
    document.title = _('ui.title');

    $('span.navbar-brand').append(_('ui.title'));
    $('#send').append(_('ui.url.send'));

    $('#request div.panel-heading').text(_('ui.request.title'));
    $('#request ul.nav a[href=#request-parameters]').text(_('ui.request.parameters.title'));
    $('#request-parameters p.help-block').text(_('ui.request.parameters.description'));
    $('#request ul.nav a[href=#request-headers]').text(_('ui.request.headers.title'));
    $('#request-headers p.help-block').text(_('ui.request.headers.description'));
    $('#request ul.nav a[href=#request-authentication]').text(_('ui.request.authentication.title'));
    $('#request-authentication p.help-block').text(_('ui.request.authentication.description'));
    $('#request-username').attr('placeholder', _('ui.request.authentication.username'));
    $('#request-password').attr('placeholder', _('ui.request.authentication.password'));

    $('#response div.panel-heading').text(_('ui.response.title'));
    $('#response-progress p.help-block').text(_('ui.response.progress'));
    $('#response ul.nav a[href=#response-headers]').text(_('ui.response.headers.title'));
    $('#response ul.nav a[href=#response-raw]').text(_('ui.response.raw.title'));
    $('#response ul.nav a[href=#response-preview]').text(_('ui.response.preview.title'));

    // List of common HTTP request headers
    var HTTP_REQUEST_HEADERS = [
        "Accept",              "Accept-Charset",  "Accept-Encoding",
        "Accept-Language",     "Accept-Datetime", "Authorization",
        "Cache-Control",       "Connection",      "Cookie",
        "Content-Length",      "Content-MD5",     "Content-Type",
        "Date",                "Expect",          "From",
        "Host",                "If-Match",        "If-Modified-Since",
        "If-None-Match",       "If-Range",        "If-Unmodified-Since",
        "Max-Forwards",        "Origin",          "Pragma",
        "Proxy-Authorization", "Range",           "Referer",
        "TE",                  "Upgrade",         "User-Agent",
        "Via",                 "Warning"
    ];

    // Initialize the method dropdown
    var request_method = new Dropdown($('#request-method'), ['GET', 'POST', 'HEAD']);

    // Initialize the MapInput controls
    var request_parameters = new MapInput($('#request-parameters-control'));
    var request_headers    = new MapInput($('#request-headers-control'), HTTP_REQUEST_HEADERS);

    // Toggles progress display
    function showProgress(show) {

        if(show) {
            $('#response-tabs').hide();
            $('#response-progress').show();
        } else {
            $('#response-progress').hide();
            $('#response-tabs').show();
        }
    }

    // Issues the request
    $('#send').click(function() {

        // Ignore an empty request
        if(!$('#url').val().trim().length)
            return;

        var request = new XMLHttpRequest();
        request.open(request_method.get(),
                     $('#url').val(),
                     true,
                     $('#request-username').val(),
                     $('#request-password').val());
        request.responseType = 'arraybuffer';

        // We must obtain an nsIHttpChannel interface in order to set certain headers
        var channel = request.channel.QueryInterface(Components.interfaces.nsIHttpChannel);

        var headers = request_headers.get();
        for(var name in headers)
            channel.setRequestHeader(name, headers[name], false);

        if(request_method.get() == 'POST')
            channel.setRequestHeader('Content-type', 'application/x-www-form-urlencoded', false);

        request.onreadystatechange = function() {

            if(request.readyState == 4) {

                var response = new Response(request);
                showProgress(false);
            }
        };

        // URL-encode the POST data
        var parameters = request_parameters.get(),
            param_str = [];
        for(var param in parameters)
            param_str.push(encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]));
        param_str = param_str.join('&');

        showProgress(true);
        $('#response-tabs .tab-pane').empty();

        request.send(param_str);
    });
};
