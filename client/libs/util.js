/**
 * ===========================================================================================
 * Exten util
 * ===========================================================================================
 */

var util = util || {};
(function() {
    "use strict";

    util.queryToObject = function(url) {
        var query = url || decodeURIComponent(window.location.search);

        if (query.startsWith('?')) {
            query = query.substr(1);
        }

        var params = {};
        query.split('&').forEach((item) => {
            if (!item) {
                return;
            }
            var pair = item.split('=');
            params[pair[0]] = pair[1];
        });
        return params;
    };

    util.objectToQueryString = function(obj) {
        var params = "";
        for (var key in obj) {
            // skip loop if the property is from prototype
            if (!obj.hasOwnProperty(key)) continue;

            params += (key + "=" + obj[key] + "&");
        }

        if (params.length > 0) {
            params = params.slice(0, -1); // remove last character
        }

        return params;
    };
    util.normalize2 = function(text) {
        var str = text || "";
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
        str = str.replace(/ + /g, " ");
        str = str.trim();
        str = str.replace(/[^A-Za-z0-9\.\/]+/g, '-');
        return str;
    };

    util.scanHtml = function(html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var layout = {};

        function addSub(layout, els, tagName) {

            if (els.children.length <= 0) return;
            //console.log("els.children", els.children);
            [...els.children].forEach(el => {
                let block = el.getAttribute("block");
                if (block == "area") {
                    var key = tagName;
                    let setting = el.getAttribute("setting")
                    if (setting) {
                        //console.log("setting", setting)
                        setting.split(";").forEach(kva => {
                            if (kva.split(":")[0] == "pos") {
                                key = kva.split(":")[1].replace(/['"\s]/g, "")
                            }
                        })
                    }
                    layout[key] = { area: [] };
                    let area = layout[key].area;
                    return addSub(area, el)
                }
                if (block == "subarea") {
                    layout.push({ subarea: [] })
                    let subarea = layout[layout.length - 1].subarea;
                    return addSub(subarea, el, "block")
                }

                if (tagName == "block") {
                    return layout.push({ id: block })
                }

                addSub(layout, el, tagName)

            })

        }

        var tagNames = ["header", "main", "footer"];
        tagNames.forEach(tagName => {
            var el = doc.getElementsByTagName(tagName)[0];
            addSub(layout, el, tagName);
        })
        return layout
    }


    util.netApiSearch = function(loc, param, callback) {
        var op2 = {
            and: [
                { name: "oid", op: "eq", val: net.user.uid }
            ],
            limit: 0,
            offset: "",
            date: { from: "", to: "" },
            cache: "no-cache"
        }

        var op = {};
        for (let key in op2) {
            op[key] = param[key] || op2[key] || "";
        }


        var options = {
            meta: {
                loc: loc
            },
            query: {
                filters: {
                    and: op.and
                },
                limit: op.limit,
                offset: op.offset,
            },
            date: op.date,
            cache: op.cache
        };

        console.log("options End", options)

        net.api.search(loc, options, callback)
    }

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
    util.timeToString = function() {


    }

    util.capitalize = function(str) {
        str = str || "";
        str = str.toLowerCase();
        return str[0].toUpperCase() + str.slice(1);
    };

    util.uploadImg = function(files, callback) {
        const url = "https://blog.devn.xyz/api/sv/upload/image";
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append("files", file);
        });

        // post form data
        const xhr = new XMLHttpRequest();
        // log response
        xhr.onload = () => {
            let res = JSON.parse(xhr.responseText)
            callback(res)
        };

        // create and send the reqeust
        xhr.open('POST', url);
        xhr.setRequestHeader("x-token", net.user.token);
        xhr.setRequestHeader("uid", net.user.uid);
        xhr.send(formData);
    }




})();