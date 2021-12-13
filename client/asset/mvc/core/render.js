(function() {
    "use strict";

    class Render {
        constructor() {
            this.eventListener();
        }

        load(callback) {
            var self = this;

            self.initModuleByUrl();

            let panels = ['top', 'left', 'center', 'right'];
            panels.forEach((position) => {
                var configs = self.config[position] || [];

                if (configs.length) {
                    self.showPanel(position, configs);
                } else {
                    // has no block --> hide panel.
                    self.hidePanel(position);
                }
            });
        }

        initModuleByUrl() {
            var self = this;

            let loc = util.getParameterByName('loc');
            if (!loc) { return; }

            var arr = loc.split('-');

            var mod = mvc[arr[1]]; // module
            // self.model = new mod.model[arr[1]](loc);

            var viewName = util.getParameterByName('v') || Object.keys(mod.view)[0];
            self.config = new mod.view[viewName]();

            self.module = mod;
        }

        showPanel(name, configs) {
            var self = this;
            self.panel = self.panel || {};

            try {

                // 1) move old blocks to temporary
                var container = document.getElementById(name + '-panel');
                var temporary = document.createDocumentFragment();
                while (container.children.length) {
                    temporary.appendChild(container.children[0]);
                }

                var oldBlocks = self.panel[name] || [];
                self.panel[name] = [];

                // 2) add all blocks in config list to panel.

                var bl, element;
                configs.forEach((cfg) => {

                    // if block is already exist --> add it back and reload.
                    for (var i = oldBlocks.length - 1; i >= 0; i--) {
                        bl = oldBlocks[i];

                        if (cfg.name === bl.name && cfg.module === bl.module) {
                            element = temporary.children[bl.eid];

                            container.appendChild(element);

                            oldBlocks.splice(i, 1);
                            self.panel[name].push(bl);

                            bl.setConfig(cfg);
                            bl.loadBlock();

                            // break;
                            return;
                        }
                    }

                    // else create new block then add.

                    var mod = mvc[cfg.module];
                    bl = new mod.block[cfg.name](cfg);
                    element = bl.getHtml();
                    container.insertAdjacentHTML('beforeend', element);
                    container.style.display = "block";

                    self.panel[name].push(bl);

                    bl.loadBlock();
                });

            } catch (e) {
                console.warn(e);
            }
        }

        hidePanel(name) {
            // console.log("hide", name)
            try {
                var self = this;

                // remove DOM of blocks
                var panel = document.getElementById(name + '-panel');
                // console.log("panel", panel)
                panel.innerHTML = "";
                panel.style.display = "none";

                // remove data of blocks
                if (self.panel) {
                    delete self.panel[name];
                }

            } catch (e) {
                console.warn(e);
            }
        }

        eventListener() {
            var self = this;

            event.on("ChangeDisplay", (eventName, obj, src) => {
                if (typeof obj !== "object") return;

                for (key in obj) {
                    if (key === "change") {
                        let pos = obj[key];
                        if (pos === "left") {
                            var panel = document.getElementById(pos + '-panel');
                            var listLeft = self.getPanelConfig(pos) || [];
                            var listCenter = self.getPanelConfig("center") || [];

                            if (!panel.innerHTML) {
                                self.showPanel(pos, listLeft);
                            } else {
                                self.hidePanel(pos);
                            }
                            dhx.awaitRedraw().then(function() {
                                // self.showPanel("center", listCenter);
                                self.panel.center[0].repaint(true);
                            })
                        }
                    }
                }


            })
        }
    }

    // export
    mvc.render = Render;
})();