/**
 * ===========================================================================================
 * Base Model.
 * ===========================================================================================
 */
(function() {
    "use strict";

    class Base extends mvc.type.ModelType {

        constructor(loc) {
            super();

            var arr = loc.split('-').filter(Boolean);
            this.oid = arr[0];    // owner id
            this.space = arr[1];
            if (arr.length === 4) {
                this.loc = loc;
            }
        }

        get objName() {
            return this.space;
        }
        get spaceLoc() {
            return (this.oid + '-' + this.space);
        }
        get itemLoc() {
            return this.loc;
        }

        get dataItem() {
            return JSON.parse(JSON.stringify(this));
        }
        set dataItem(item) {
            item = item || {};
            if (item.space !== this.space) {
                return console.warn("Worng data type");
            }

            let itm = JSON.parse(JSON.stringify(item));
            delete itm.$selected;
            delete itm._view;

            Object.keys(itm).forEach(key => {
                this[key] = itm[key];
            });
        }
    }

    // export
    mvc.register('core', Base, 'base');
})();