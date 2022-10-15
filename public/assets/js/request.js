function httpRequest(reqParams) {
    var _endpoint = reqParams.url; 
    var _params = reqParams.data;
    var _headers = reqParams.headers;
    var _method = reqParams.method ? reqParams.method.toUpperCase() : 'GET';
    var buildParamMethods = ['POST','DELETE','PUT','PATCH'];
    var prefix = '';
    
    // if (typeof localePrefix != 'undefined') {
    //     prefix = '/' + localePrefix;
    // }
    // _endpoint = prefix + _endpoint;

    var options = {
        method: _method ? _method : 'GET',
        url: _endpoint,
    }

    if (buildParamMethods.includes(options.method)) {
        options.data = _params;
    }

    if (typeof _headers !== 'undefined') {
        options.header = _headers;
    }

    return $.ajax(options);
}