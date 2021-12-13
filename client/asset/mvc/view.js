/**
 * ===========================================================================================
 * Config view of page
 * ===========================================================================================
 */
(function() {
    "use strict";

    class List extends mvc.type.ViewType {
        get top() {
            return [{ name: "app-topbar", module: "common" }];
        }
        get left() {
            return [{ name: "wg-menu", module: "common" }];
        }
        get center() { return []; }
        get right() { return []; }
    }

    class Board extends mvc.type.ViewType {

        get top() {
            return [{ name: "app-topbar", module: "common" }];
        }
        get left() {
            return [{ name: "wg-menu", module: "common" }];
        }
        get center() { return []; }
        get right() { return []; }
    }

    class Detail extends mvc.type.ViewType {
        get top() {
            return [{ name: "app-topbar", module: "common" }];
        }
        get left() {
            return [{ name: "wg-menu", module: "common" }];
        }
        get center() { return []; }
        get right() { return []; }
    }

    // export
    mvc.register('core', List, 'list');
    mvc.register('core', Board, 'board');
    mvc.register('core', Detail, 'detail');
})();











//