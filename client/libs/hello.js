//----------------------------------------
net.host = "http://localhost:3000"; // <------------- Edit for your site
//----------------------------------------



(function() {
    "use strict";
    const SAMPLES = {};
    const TEST_SPACE = "message";

    // Test App

    function saveItem(callback) {

        var locSpace = [net.user.uid, TEST_SPACE].join('-');

        var item = SAMPLES[TEST_SPACE];

        display('data-send', item);

        net.api.saveDataItem(locSpace, item, (data) => {
            console.log(data);

            callback(data.loc);
        });
    }

    function getSavedItem(loc, callback) {
        net.api.getDataItem(loc, callback);
    }

    function display(elmentId, item) {

        var container = document.getElementById(elmentId);

        var txt = '<i>' + JSON.stringify(item) + '</i><br><br>';
        container.insertAdjacentHTML('beforeend', txt);
    }

    var button = document.getElementById('send-button');
    button.onclick = function() {
        saveItem((loc) => {
            getSavedItem(loc, (item) => {
                display('data-get', item);
                getListItem();
            });
        });
    };


    function getListItem() {

        var locSpace = [net.user.uid, TEST_SPACE].join('-');

        var options = {
            query: {
                filters: {
                    and: [
                        { name: "oid", op: "eq", val: net.user.uid }
                    ]
                },
                limit: 0,
                offset: ""
            },
            date: "",
            cache: "no-cache"
        };

        net.api.search(locSpace, options, (data) => {
            console.log(data);
        });
    }






    //------------------------------------------------------------ sample space list

    SAMPLES.app = {
        title: "CMS",
        domain: "cms.savechinese.org",
        logo: "",
        config: "loc-config", // log of config
    };

    SAMPLES.web = {
        title: "Test website",
        domain: "blog.devn.xyz",
        logo: "",
        theme: "loc-of-theme-default",
        sitemap: "loc-of-map",
        config: "loc-config", // log of config
    };

    SAMPLES.message = {
        content: "Hello from client app " + new Date().getTime()
    };



    function setThemeForWeb() {
        var loc = "kmvo0eyf-web-kqj65naq-ccgs6og1m7i8";
        getSavedItem(loc, (item) => {
            item.theme = "kmvo0eyf-theme-kqj6t8zt-ccgskqbztyrk";
            console.log('setThemeForWeb', item);

            net.api.saveDataItem(loc, item, (data) => {
                console.log('setThemeForWeb', data);
            });
        });

    }

    // setThemeForWeb();

    function publishPost() {
        var api = "api/sv/publish/post";

        var options = {
            locPost: "kmvo0eyf-post-kqj5ylej-ccgx21ynha4g",
            locWeb: "kmvo0eyf-web-kqj65naq-ccgs6og1m7i8"
        };

        net.post(api, options, (response) => {
            console.log('publishPost', response);
        });
    }

    // publishPost();

    function activeTheme() {
        var api = "api/sv/active/theme";

        var options = {
            locWeb: "kmvo0eyf-web-kqj65naq-ccgs6og1m7i8",
            locTheme: "kmvo0eyf-theme-kqj6t8zt-ccgskqbztyrk"
        };

        net.post(api, options, (response) => {
            console.log('activeTheme', response);
        });
    }

    // activeTheme();


    function testConverImage() {
        var api = "api/sv/convert/image";
        var options = {
            loc: "kmvo0eyf-photo-kqg2c0ts-ccexnd645vy8",
            overwrite: "yes"
        };
        net.post(api, options, (response) => {
            console.log('testConverImage', response);
        });
    }

    // testConverImage();

















    //--
})();