/*
 * resteasy.js - Interactivity for the REST Easy addon
 * Copyright 2013 - Nathan Osman
 */

function RestEasy() {

    // Begin initializing the UI
    $('title').translate('ui.title');
    $('#send').translate('ui.url.send');

    $('#request div.panel-heading').translate('ui.request.title');
    $('#request ul.nav a[href=#request-body]').translate('ui.request.body.title');
    $('#request ul.nav a[href=#request-parameters]').translate('ui.request.parameters.title');
    $('#request-parameters p.help-block').translate('ui.request.parameters.description');
    $('#request ul.nav a[href=#request-headers]').translate('ui.request.headers.title');
    $('#request-headers p.help-block').translate('ui.request.headers.description');
    $('#request ul.nav a[href=#request-authentication]').translate('ui.request.authentication.title');
    $('#request-authentication p.help-block').translate('ui.request.authentication.description');
    
    $.translate('ui.request.authentication.username', function(text) { $('#request-username').attr('placeholder', text); });
    $.translate('ui.request.authentication.password', function(text) { $('#request-password').attr('placeholder', text); });

    $('#response div.panel-heading').translate('ui.response.title');
    $('#response-progress p.help-block').translate('ui.response.progress');
    $('#response ul.nav a[href=#response-headers]').translate('ui.response.headers.title');
    $('#response ul.nav a[href=#response-raw]').translate('ui.response.raw.title');
    $('#response ul.nav a[href=#response-preview]').translate('ui.response.preview.title');

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
       
        // new rest call

        // Issue the request.
        $.request({
            url: $('#url').val(),
            method: request_method.get(),
            content: $('#request-body-control').val(),
            username: $('#request-username').val(),
            password: $('#request-password').val(),
            headers: request_headers.get(),
            parameters: request_parameters.get()
        });
        
        showProgress(true);
        $('#response-tabs .tab-pane').empty();
    });
    
    $.response = function(data) {
        
        new Response(data);
        showProgress(false);
    };

    // Ensure that the panels are sized correctly when the page is resized
    $(window).resize(function() {

        function setHeight(element, margin) {

            // Calculate the page offset of the element and set the height accordingly
            var height = $(window).height() - element.offset().top;
            element.css('height',  (height - margin) + 'px');
        }

        // Do the same for the panels
        setHeight($('.panel'),    parseInt($('.panel').css('marginBottom')));
        setHeight($('.tab-pane'), parseInt($('.panel').css('marginBottom')) + parseInt($('.panel-body').css('paddingBottom')));

    });
    
    // This is so evil, I hardly know where to begin...
    window.setTimeout(function() { $(window).resize(); }, 200);
};
