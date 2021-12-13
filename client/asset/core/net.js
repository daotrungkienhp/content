/*
 * ===========================================================================================
 * net
 * - require util.js
 * ===========================================================================================
 */
var net = net || {};

(function() {
    "use strict";

    net.get = function(url, callback) {
        console.log('get', url);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState === 4) {
                let resp;
                if (this.status === 200) {
                    callback(this.responseText);
                } else {
                    console.log(url, this.status, this.statusText);
                    callback("");
                }
            }
        };

        xhr.open("GET", url, true);
        xhr.setRequestHeader("x-token", net.user.token);
        xhr.setRequestHeader("uid", net.user.uid);
        xhr.setRequestHeader("path", url);
        xhr.send();
    };

    net.post = function(url, option, callback) {

        var loc = option.loc;
        var params = JSON.parse(JSON.stringify(option));
        delete params.loc;

        let options = {
            meta: JSON.stringify({
                loc: option.loc
            }),
            params: JSON.stringify(params),
            uid: net.user.uid,
            token: net.user.token
        };

        var serverUrl = net.getServerByLoc(loc) + '/' + url;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                console.warn(serverUrl, this.status, this.statusText);
                return callback({});
            }

            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                let resp = {};
                try {
                    resp = JSON.parse(this.responseText);
                } catch (error) {
                    console.error(error, url, this.status, this.statusText, this.responseText);
                }
                return callback(resp || {});
            }
        };

        xhr.open("POST", serverUrl, true);
        xhr.timeout = 10000; // 10s
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("x-token", net.user.token);
        xhr.setRequestHeader("uid", net.user.uid);
        xhr.send(toRequestString(options));
    };

    net.getServerByLoc = function(loc) {
        // TODO: implementation
        // from loc --> owner --> server url

        return net.host;
    }

    //--- API
    net.api = net.api || {};

    net.api.getDataItem = function(loc, callback) {
        post('get', loc, null, null, callback);
    };

    net.api.getDataList = function(locs, callback) {
        post('get-data-list', locs, null, null, callback);
    };

    net.api.removeDataList = function(locs, callback) {
        post('remove-list', locs, null, null, callback);
    };

    net.api.saveDataItem = function(loc, data, callback) {
        post('save', loc, null, data, callback);
    };

    net.api.removeDataItem = function(loc, callback) {
        post('remove', loc, null, null, callback);
    };

    net.api.createBatch = function(space, params, data, callback) {
        post('create-batch', space, params, data, callback);
    };

    net.api.updateBatch = function(locs, data, callback) {
        post('update-batch', locs, null, data, callback);
    };


    net.api.search = function(space, params, callback) {
        post('search', space, params, null, callback);
    };

    //---
    function post(api, loc, params, data, callback) {

        callback = callback || function() {};

        let options = {
            api_name: api,
            meta: JSON.stringify((Array.isArray(loc)) ? {
                locs: loc
            } : {
                loc: loc
            }),
            uid: net.user.uid,
            token: net.user.token
        };

        if (params) {
            options.params = JSON.stringify(params);
        }

        if (data) {
            options.data = JSON.stringify(data);
            // options.data = encodeURIComponent(JSON.stringify(data));
        }

        var url = net.getServerByLoc(loc) + '/api/' + api;
        console.log('post', url, options.meta);

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status != 200) {
                console.warn(url, this.status, this.statusText);
                return callback({});
            }

            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                let resp = {};
                try {
                    resp = JSON.parse(this.responseText);
                } catch (error) {
                    console.error(error, url, this.status, this.statusText, this.responseText);
                }
                return callback(resp.data || {});
            }
        };

        xhr.open("POST", url, true);
        xhr.timeout = 10000; // 10s
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("x-token", net.user.token);
        xhr.setRequestHeader("uid", net.user.uid);
        xhr.send(toRequestString(options));
    };

    function toRequestString(obj) {
        var str = "";
        for (var key in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(key)) continue;

            str += (key + "=" + obj[key] + "&");
        }

        if (str.length > 0) {
            str = str.slice(0, -1); // remove last "&"" character
        }

        return str;
    };

})();