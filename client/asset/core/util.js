var util = util || {};

//--------- storerage
(function() {

    util.storage = util.storage || {};

    util.storage.getItem = function(name) {
        var data = localStorage.getItem(name);
        return (data) ? JSON.parse(data) : null;
    };

    util.storage.setItem = function(name, value) {
        localStorage.setItem(name,
            JSON.stringify(value));
    };

    util.storage.removeItem = function(name) {
        localStorage.removeItem(name);
    };

})();

//------------------ Cookie
(function() {
    'use strict';
    //https://github.com/js-cookie/js-cookie

    var defaultConverter = {
        read: function(value) {
            return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
        },
        write: function(value) {
            return encodeURIComponent(value).replace(
                /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
                decodeURIComponent
            );
        }
    };

    function assign(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                target[key] = source[key];
            }
        }
        return target;
    }

    function init(converter, defaultAttributes) {
        function set(key, value, attributes) {
            if (typeof document === 'undefined') {
                return;
            }

            attributes = assign({}, defaultAttributes, attributes);

            if (typeof attributes.expires === 'number') {
                attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
            }
            if (attributes.expires) {
                attributes.expires = attributes.expires.toUTCString();
            }

            key = encodeURIComponent(key)
                .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
                .replace(/[()]/g, escape);

            value = converter.write(value, key);

            var stringifiedAttributes = '';
            for (var attributeName in attributes) {
                if (!attributes[attributeName]) {
                    continue;
                }

                stringifiedAttributes += '; ' + attributeName;

                if (attributes[attributeName] === true) {
                    continue;
                }

                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
            }

            return (document.cookie = key + '=' + value + stringifiedAttributes);
        }

        function get(key) {
            if (typeof document === 'undefined' || (arguments.length && !key)) {
                return;
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var jar = {};
            for (var i = 0; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var value = parts.slice(1).join('=');

                if (value[0] === '"') {
                    value = value.slice(1, -1);
                }

                try {
                    var foundKey = defaultConverter.read(parts[0]);
                    jar[foundKey] = converter.read(value, foundKey);

                    if (key === foundKey) {
                        break;
                    }
                } catch (e) {}
            }

            return key ? jar[key] : jar;
        }

        return Object.create({
            set: set,
            get: get,
            remove: function(key, attributes) {
                set(
                    key,
                    '',
                    assign({}, attributes, {
                        expires: -1
                    })
                );
            },
            withAttributes: function(attributes) {
                return init(this.converter, assign({}, this.attributes, attributes));
            },
            withConverter: function(converter) {
                return init(assign({}, this.converter, converter), this.attributes);
            }
        }, {
            attributes: {
                value: Object.freeze(defaultAttributes)
            },
            converter: {
                value: Object.freeze(converter)
            }
        });
    }

    function getRootDomain() {

        // Todo: get root domain with refer public suffix
        // https://publicsuffix.org/list/public_suffix_list.dat

        var domain = location.hostname.split('.').slice(-2).join('.');
        return (domain === 'localhost') ? domain : '.' + domain;
    }

    //--- export
    util.cookie = init(defaultConverter, {
        path: '/',
        domain: getRootDomain()
    });
})();

//------------------ Others
(function() {
    "use strict";


    util.documentReady = function(callback) {
        // in case the document is already rendered
        if (document.readyState != 'loading') callback();
        // modern browsers
        else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
        // IE <= 8
        else document.attachEvent('onreadystatechange', function() {
            if (document.readyState == 'complete') callback();
        });
    };

    util.random = function(length) {
        var ran = '';
        var chat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var leng = chat.length;
        for (var i = 0; i < length; i++) {
            ran += chat.charAt(Math.floor(Math.random() * leng));
        }
        return ran;
    };

    util.getParameterByName = function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    util.stringToTime = function(str) {
        let d = new Date(parseInt(str, 36));

        let fd = {};

        fd.yyyy = '' + d.getFullYear();

        fd.mm = d.getMonth() + 1;
        fd.mm = (fd.mm < 10) ? '0' + fd.mm : '' + fd.mm;

        fd.dd = d.getDate();
        fd.dd = (fd.dd < 10) ? '0' + fd.dd : '' + fd.dd;
        let time = [fd.dd, fd.mm, fd.yyyy].join('/');
        return time
    }

})();