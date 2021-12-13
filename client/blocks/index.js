(function() {
    "use strict";


    function random(length) {
        var ran = '';
        var chat = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var leng = chat.length;
        for (var i = 0; i < length; i++) {
            ran += chat.charAt(Math.floor(Math.random() * leng));
        }
        return ran;
    };

    function addBlocks() {
        var src = document.currentScript.src.replace('index.js', '');

        var blocks = document.getElementsByTagName('section');
        for (var i = 0; i < blocks.length; i++) {
            var bl = blocks[i];
            var name = bl.getAttribute('block');

            if (name) {
                bl.id = bl.id || ("bl-" + random(12));

                var script = document.createElement('script');
                script.setAttribute('type', "text/javascript");
                script.setAttribute('el', bl.id);
                script.setAttribute('src', src + name + "/index.js");

                document.body.appendChild(script);
            }
        }
    }


    addBlocks();

})();