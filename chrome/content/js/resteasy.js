/*
 * resteasy.js - Interactivity for the REST Easy addon
 * Copyright 2013 - Nathan Osman
 */

function RestEasy() {
    
    // Initialize the method dropdown
    var request_method = new Dropdown($('#request-method'), ['GET', 'POST', 'HEAD']);
    
    // Initialize the MapInput controls
    var request_parameters = new MapInput($('#request-parameters-control'));
    var request_headers    = new MapInput($('#request-headers-control'));
    
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
        
        var request = new XMLHttpRequest();
        request.open(request_method.get(),
                     $('#url').val(),
                     true,
                     $('#request-username').val(),
                     $('#request-password').val());
        
        var headers = request_headers.get();
        for(var name in headers)
            request.setRequestHeader(name, headers[name]);
        
        if(request_method.get() == 'POST')
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
        request.onreadystatechange = function() {
            
            if(request.readyState == 4) {
                
                var response = new Response(request);
                response.appendHeaders($('#response-headers'));
                response.appendRaw($('#response-raw'));
                response.appendPreview($('#response-preview'));
                
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
        
    }).resize();
};
