/**
 * ===========================================================================================
 * Block is data control on the view.
 * ===========================================================================================
 */

(function() {
    "use strict";

    const SCRIPT = document.currentScript;

    class Base extends mvc.type.BlockType {

        constructor(config) {
            super();

            this.script = SCRIPT;
            this.setConfig(config);

            this.containerId = "bl-" + util.random(5);
            this.eid = this.containerId; // short
        }

        getHtml() {
            var self = this;

            let html = '';
            html += '<section id="' + self.eid + '" class="' + self.name + '">';
            html += '</section>';

            return html;
        }

        loadBlock(callback) {
            var self = this;
            callback = callback || function() {};

            if (self.reload) {
                return callback();
            }
            self.reload = true;

            var lastTemplate = document.getElementById(self.containerId);
            self.addTemplate(self.containerId, callback);
        }






        /**
         * ===========================================================================================
         * Utilities functions
         * ===========================================================================================
         */

        setConfig(config) {

            if (this.name && this.name !== this.config.name) {
                return console.warn('Wrong block config type');
            }

            this.config = config || {};
            this.name = config.name;
            this.module = this.config.module;
        }

        getModelByUrl() {
            var self = this;

            let loc = util.getParameterByName('loc');
            if (!loc) { return; }

            var arr = loc.split('-');

            var mod = mvc[arr[1]]; // module

            self.model = new mod.model[arr[1]](loc);
            self.screen = util.getParameterByName('v') || Object.keys(mod.view)[0];
        }

        addTemplate(elementId, callback) {
            var self = this;

            if (!self.script) {
                console.warn('can not load block', self.name);
                return callback();
            }

            var src = self.script.src;
            self.getFile(src.replace('index.js', 'style.css'), (css) => {
                self.getFile(src.replace('index.js', 'index.html'), (html) => {

                    var str = "";
                    str += '<style type="text/css">' + css + '</style>';
                    str += html;

                    var block = document.getElementById(elementId);
                    if (!block) {
                        return callback();
                    }

                    block.innerHTML = ""; // clean
                    block.insertAdjacentHTML("beforeend", str);

                    //-----> Todo: set block id for all child element.
                    // consider to remove this feature later.
                    self.setBlockIds(block);
                    //----> End

                    callback();
                });
            });
        }

        setBlockIds(blockElement) {
            var blockId = this.eid;
            var el, childs = blockElement.getElementsByTagName("*");

            for (var i = childs.length - 1; i >= 0; i--) {
                el = childs[i];
                if (el.id) {
                    el.id = blockId + '-' + el.id;
                }
            }
        }

        getElementId(id) {
            return this.eid + '-' + id;
        }

        getFile(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState === XMLHttpRequest.DONE) {
                    return callback(this.responseText);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
        };
    }

    // export
    mvc.register('core', Base, 'base');

})();