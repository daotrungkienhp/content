var event = event || { _listeners: {} };

(function() {
    "use strict";

    event.on = function(eventName, callback) {
        if (!eventName || typeof(eventName) !== 'string') {
            return;
        }

        var name = eventName.toLowerCase();
        var eid = 'ev-' + util.random(18);
        callback.___eid = eid;
        callback.___ename = name;
        event._listeners[name] = event._listeners[name] || {};
        event._listeners[name][eid] = callback;
    };
    event.fire = function(eventName, msg, src) {
        // console.log('[Fire event]', eventName, msg, src);
        var name = (eventName || "").toLowerCase();

        var list = event._listeners[name] || {};
        Object.keys(list).forEach((eid) => {
            if (list[eid]) {
                list[eid](eventName, msg, src);
            }
        });
    };
    event.remove = function(callback) {
        try {
            delete event._listeners[callback.___ename][callback.___eid];
        } catch (e) {
            console.warn(e);
        }
    };

    event.clear = function(eventName) {
        var name = (eventName || "").toLowerCase();
        try {
            delete event._listeners[name];
        } catch (e) {
            console.warn(e);
        }
    }

})();