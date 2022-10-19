"use strict";
var debug_mode = true;
var website = window.website || {};
var $ = window.$ || null;
var axios = window.axios || null;
var CryptoJS = window.CryptoJS || null;
(function () {
    website["script"] = function (script_url, ready_fn) {
        (function () {
            var timer = null;
            exec_load_fn();
            function exec_load_fn() {
                if (null != timer)
                    clearTimeout(timer);
                timer = setTimeout(function () {
                    if ("complete" == document.readyState) {
                        load_script_fn(script_url, ready_fn);
                    }
                    else {
                        exec_load_fn();
                    }
                }, 60);
            }
        })();
    };
    function load_script_fn(script_url, ready_fn) {
        if (null == ready_fn)
            ready_fn = function () { };
        var framework_label = "my_script_loader";
        var container_div = document.querySelector("div[_framework_key=" + framework_label + "]");
        (function () {
            if (null == container_div) {
                container_div = document.createElement('div');
                container_div.setAttribute("_framework_key", framework_label);
                document.body.appendChild(container_div);
            }
        })();
        var catch_count = 0;
        var target_count = 0;
        (function () {
            if (Array.isArray(script_url)) {
                target_count = script_url.length;
                for (var url_index in script_url) {
                    var url = script_url[url_index];
                    rm_rep_script(url);
                    append_script_tag(url, container_div, catch_script_done, catch_script_fail);
                }
            }
            else {
                target_count = 1;
                rm_rep_script(script_url);
                append_script_tag(script_url, container_div, catch_script_done, catch_script_fail);
            }
        })();
        function catch_script_done(evt) {
            catch_count++;
            if (target_count == catch_count)
                ready_fn();
        }
        function catch_script_fail(evt) {
            catch_count++;
            if (target_count == catch_count)
                ready_fn();
            console.error(evt);
        }
    }
    function append_script_tag(url, container_div, ready_fn, error_fn) {
        var scriptTag = document.createElement('script');
        scriptTag.src = url;
        if (null != ready_fn)
            scriptTag.onload = ready_fn;
        if (null != error_fn)
            scriptTag.onerror = error_fn;
        container_div.append(scriptTag);
    }
    var prefix = [];
    (function () {
        prefix.push(window.location.protocol);
        prefix.push("//");
        prefix.push(window.location.hostname);
        prefix.push(window.location.pathname);
    })();
    function rm_rep_script(url) {
        var elems = document.querySelectorAll("script");
        var chk_str = prefix.join("") + url;
        for (var i = 0, len = elems.length; i < len; i++) {
            var elem = elems[i];
            if (elem.src.includes(chk_str)) {
                elem.remove();
            }
        }
    }
})();
(function () {
    website["randomString"] = function (len) {
        var t = "abcdefghijklmnopqrstuvwxyz0123456789";
        var r = [];
        var l = 16;
        var tLen = t.length;
        if (null != len)
            l = len;
        for (var i = 0; i < l; i++) {
            var c = t.charAt(Math.floor(Math.random() * tLen));
            r.push(c);
        }
        return r.join("");
    };
})();
(function () {
    (function () {
        website["get"] = function (reqObj) {
            var def = $.Deferred();
            if (null != reqObj["header"] && false == Array.isArray(reqObj["header"])) {
                console.error("header 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var headers = {};
            (function () {
                var arr = reqObj["header"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    headers[key] = value;
                }
            })();
            if (null != reqObj["data"] && false == Array.isArray(reqObj["data"])) {
                console.error("data 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var params = new URLSearchParams();
            (function () {
                var arr = reqObj["data"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    params.append(key, value);
                }
            })();
            var config = {
                transformResponse: [
                    function (data) { return data; }
                ],
                headers: headers,
                params: params
            };
            axios.get(reqObj["url"], config).then(function (response) {
                var respObj = {
                    status: "done",
                    status_code: response.status,
                    data: response.data
                };
                def.resolve(respObj.data);
            }).catch(function (err) {
                if (debug_mode)
                    console.error(err);
                def.reject(err);
            });
            return def;
        };
    })();
    (function () {
        website["post"] = function (reqObj) {
            var def = $.Deferred();
            if (null != reqObj["header"] && false == Array.isArray(reqObj["header"])) {
                console.error("header 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var headers = {};
            (function () {
                var arr = reqObj["header"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    headers[key] = value;
                }
            })();
            if (null != reqObj["data"] && false == Array.isArray(reqObj["data"])) {
                console.error("data 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var params = new URLSearchParams();
            (function () {
                var arr = reqObj["data"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    params.append(key, value);
                }
            })();
            var config = {
                transformResponse: [
                    function (data) { return data; }
                ],
                headers: headers
            };
            axios.post(reqObj["url"], params, config).then(function (response) {
                var respObj = {
                    status: "done",
                    status_code: response.status,
                    data: response.data
                };
                def.resolve(respObj.data);
            }).catch(function (err) {
                if (debug_mode)
                    console.error(err);
                def.reject(err);
            });
            return def;
        };
    })();
    (function () {
        website["post_json"] = function (reqObj) {
            var def = $.Deferred();
            if (null != reqObj["header"] && false == Array.isArray(reqObj["header"])) {
                console.error("header 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var headers = {};
            (function () {
                var arr = reqObj["header"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    headers[key] = value;
                }
            })();
            axios.post(reqObj["url"], reqObj["text"]).then(function (response) {
                var respObj = {
                    status: "done",
                    status_code: response.status,
                    data: response.data
                };
                def.resolve(respObj.data);
            }).catch(function (err) {
                if (debug_mode)
                    console.error(err);
                def.reject(err);
            });
            return def;
        };
    })();
    (function () {
        website["post_form_data"] = function (reqObj) {
            var def = $.Deferred();
            if (null != reqObj["header"] && false == Array.isArray(reqObj["header"])) {
                console.error("header 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var headers = {};
            (function () {
                var arr = reqObj["header"];
                for (var index in arr) {
                    var obj = arr[index];
                    var key = obj["key"];
                    var value = obj["value"];
                    headers[key] = value;
                }
            })();
            if (null != reqObj["data"] && false == Array.isArray(reqObj["data"])) {
                console.error("data 參數必須使用 array 型態");
                def.reject();
                return;
            }
            var formData = new FormData();
            (function () {
                if (null != reqObj["data"]) {
                    var arr = reqObj["data"];
                    for (var index in arr) {
                        var obj = arr[index];
                        formData.append(obj["key"], obj["value"]);
                    }
                }
            })();
            var config = {
                transformResponse: [function (data) { return data; }],
                headers: headers,
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    var percentStr = String(percentCompleted);
                    var respObj = {
                        status: "upload_progress",
                        progress_value: percentStr
                    };
                    def.notify(respObj);
                }
            };
            axios.post(reqObj["url"], formData, config).then(function (response) {
                var respObj = {
                    status: "done",
                    status_code: response.status,
                    data: response.data
                };
                def.resolve(respObj.data);
            }).catch(function (err) {
                if (debug_mode)
                    console.error(err);
                def.reject(err);
            });
            return def;
        };
    })();
})();
(function () {
    website["dialog"] = function (initObj) {
        var def = $.Deferred();
        var dialogId = "_dialog_" + website.randomString(16);
        var dialogElem = $(buildDialogHtml());
        (function () {
            dialogElem.attr("modal_dialog_ssid", dialogId);
            dialogElem.css("z-index", "10");
            dialogElem.css("background-color", "rgba(90,90,90,0.5)");
            if (null != initObj["content"] && initObj["content"].length > 0) {
                dialogElem.find("div[modal_dialog_key=wrap]").append(initObj["content"]);
            }
        })();
        $("body").append(dialogElem);
        dialogElem.css("display", "flex");
        var dialogObj = {
            dialog: dialogElem.find("div[modal_dialog_key=wrap]"),
            overlay: dialogElem,
            close: function () {
                dialogElem.remove();
            }
        };
        (function () {
            var enable_esc_key = "true";
            if (null != initObj["escape_key"]) {
                enable_esc_key = initObj["escape_key"];
            }
            if ("true" == enable_esc_key) {
                dialogElem.on("keydown", function (evt) {
                    if (27 == evt.keyCode) {
                        dialogObj.close();
                    }
                });
            }
        })();
        (function () {
            dialogElem.focus();
        })();
        def.resolve(dialogObj);
        return def;
    };
    function buildDialogHtml() {
        var overlay_elem = $("<div modal_dialog_key='overlay' tabindex='0'></div>");
        (function () {
            overlay_elem.css("display", "none");
            overlay_elem.css("align-items", "stretch");
            overlay_elem.css("justify-content", "stretch");
            overlay_elem.css("position", "fixed");
            overlay_elem.css("top", "0px");
            overlay_elem.css("left", "0px");
            overlay_elem.css("width", "100vw");
            overlay_elem.css("height", "100vh");
            overlay_elem.css("overflow", "auto");
            overlay_elem.css("backdrop-filter", "blur(1px)");
        })();
        (function () {
            var wrap_html = [];
            wrap_html.push("<div style='flex: 1;'></div>");
            wrap_html.push("<div style='flex-shrink: 0;display: flex;align-items: stretch;justify-content: stretch;flex-direction: column;'>");
            wrap_html.push("<div style='flex: 1;'></div>");
            wrap_html.push("<div modal_dialog_key='wrap' style='flex-shrink: 0;'></div>");
            wrap_html.push("<div style='flex: 1;'></div>");
            wrap_html.push("</div>");
            wrap_html.push("<div style='flex: 1;'></div>");
            overlay_elem.html(wrap_html.join(""));
        })();
        return overlay_elem.prop("outerHTML");
    }
})();
(function () {
    website["redirect"] = function (url, onCache) {
        if (null == onCache)
            onCache = true;
        var targetURL = null;
        if (null == url) {
            targetURL = location.protocol + '//' + location.host + location.pathname;
        }
        else {
            targetURL = url;
        }
        if (onCache) {
            location.href = targetURL;
        }
        else {
            var ts = Date.now();
            location.href = targetURL + "?ei=" + ts;
        }
    };
})();
(function () {
    website["base64_encode"] = function (content) {
        if (null == content) {
            console.error("b64 encode content is null!");
            return null;
        }
        var byteArr = CryptoJS.enc.Utf8.parse(content);
        return CryptoJS.enc.Base64.stringify(byteArr);
    };
    website["base64_url_encode"] = function (content) {
        var res_str = url_safe_withoutPadding(website["base64_encode"](content));
        return res_str;
    };
    website["base64_decode"] = function (content) {
        if (null == content) {
            console.error("b64 decode content is null!");
            return null;
        }
        var byteArr = CryptoJS.enc.Base64.parse(decode_url_safe(content));
        var res_str = byteArr.toString(CryptoJS.enc.Utf8);
        return res_str;
    };
    website["base64_url_decode"] = function (content) {
        return website["base64_decode"](content);
    };
    function url_safe_withoutPadding(str) {
        return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
    }
    function decode_url_safe(str) {
        return str.replace(/-/g, '+').replace(/_/g, '/');
    }
})();
(function () {
    website["currency_number"] = function (num_val) {
        return new Intl.NumberFormat('zh-TW', { style: 'decimal', currency: 'TWD' }).format(num_val);
    };
})();
(function () {
    website["print"] = function (elem, width, height) {
        var w_width = $(window).width() * 0.9;
        if (null != width)
            w_width = width;
        var w_height = $(window).height() * 0.9;
        if (null != w_height)
            w_height = height;
        (function () {
            if (600 > w_width)
                w_width = 600;
            if (600 > w_height)
                w_height = 600;
        })();
        var mywindow = window.open('', '', 'left=0,top=0,width=' + w_width + ',height=' + w_height + ',toolbar=0,scrollbars=0,status=0,addressbar=0');
        var is_chrome = Boolean(mywindow.chrome);
        mywindow.document.write(elem.prop("outerHTML"));
        mywindow.document.close();
        if (is_chrome) {
            var b_need_load = false;
            if (elem.prop("outerHTML").includes("<img"))
                b_need_load = true;
            if (b_need_load) {
                mywindow.onload = function () {
                    mywindow.focus();
                    mywindow.print();
                    mywindow.close();
                };
            }
            else {
                mywindow.focus();
                mywindow.print();
                mywindow.close();
            }
        }
        else {
            mywindow.document.close();
            mywindow.focus();
            mywindow.print();
            mywindow.close();
        }
    };
})();
(function () {
    website["scroll_width"] = function () {
        var scr = null;
        var inn = null;
        var wNoScroll = 0;
        var wScroll = 0;
        scr = document.createElement('div');
        var div_id = "_scroll_test_" + website.randomString(16);
        scr.id = div_id;
        scr.style.position = 'absolute';
        scr.style.top = '-1000px';
        scr.style.left = '-1000px';
        scr.style.width = '100px';
        scr.style.height = '50px';
        scr.style.overflow = 'hidden';
        inn = document.createElement('div');
        inn.style.width = '100%';
        inn.style.height = '200px';
        scr.appendChild(inn);
        document.getElementsByTagName('html')[0].appendChild(scr);
        wNoScroll = inn.offsetWidth;
        scr.style.overflow = 'auto';
        wScroll = inn.offsetWidth;
        var elem = document.getElementById(div_id);
        if (null != elem)
            elem.remove();
        return (wNoScroll - wScroll);
    };
})();
(function () {
    website["float"] = function (number, fractionDigits) {
        var def = fractionDigits || 2;
        return Math.round(number * Math.pow(10, def)) / Math.pow(10, def);
    };
})();
(function () {
    website["replace_all"] = function (str, scan_str, fix_str) {
        return str.split(scan_str).join(fix_str);
    };
})();
var moment = window.moment || null;
(function () {
    var arr = [];
    (function () {
        arr.push("script/jquery/jquery.min.js");
        arr.push("script/cryptojs/core.min.js");
        arr.push([
            "script/jsoneditor/jsoneditor.min.js",
            "script/cryptojs/sha256.min.js",
            "script/cryptojs/enc-base64.min.js",
            "script/cryptojs/aes/hmac.min.js",
            "script/cryptojs/aes/md5.min.js",
            "script/cryptojs/aes/sha1.min.js",
        ]);
        arr.push("script/cryptojs/aes/evpkdf.min.js");
        arr.push("script/cryptojs/aes/cipher-core.min.js");
        arr.push("script/cryptojs/aes/mode-ctr.min.js");
        arr.push("script/cryptojs/aes/aes.min.js");
    })();
    (function () {
        var tmpPath = null;
        loadNext();
        function loadNext() {
            tmpPath = arr.shift();
            if (null != tmpPath) {
                website.script(tmpPath, function () {
                    loadNext();
                });
            }
            else {
                scriptReady();
            }
        }
    })();
    function scriptReady() {
        if (null == website.ready) {
            console.error("該頁面不具有 window.website.ready 方法，無法完成初始化呼叫");
        }
        else {
            setTimeout(function () {
                website.ready();
            }, 1);
        }
    }
})();
(function () {
    website["ready"] = function () {
        website["script"]("script/module/index.js", function () {
            console.log("script load ready.");
        });
    };
})();
