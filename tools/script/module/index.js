(function(){
    var durationTimer = {};
    (function(){
        $("div[ui_key=btn_a]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_a]").val("");
            var value = $("textarea[ui_key=input_a]").val().trim();
            var res = null;
            (function(){
                var byteArr = CryptoJS.enc.Utf8.parse(value);
                res = url_safe_withoutPadding( CryptoJS.enc.Base64.stringify(byteArr) );
            })();
            $("textarea[ui_key=result_a]").val(res);
        });
        // https://jsfiddle.net/magikMaker/7bjaT/
        function url_safe_withoutPadding(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        }
    })();
    (function(){
        $("div[ui_key=btn_b]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_b]").val("");
            var value = $("textarea[ui_key=input_b]").val().trim();
            var res = null;
            (function(){
                var byteArr = CryptoJS.enc.Base64.parse( decode_url_safe( value ) );
                res = byteArr.toString(CryptoJS.enc.Utf8);
            })();
            $("textarea[ui_key=result_b]").val(res);
        });
        // https://jsfiddle.net/magikMaker/7bjaT/
        function decode_url_safe(str) {
            return str.replace(/-/g, '+').replace(/_/g, '/');
        }
    })();
    (function(){
        $("div[ui_key=btn_c]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_c]").val("");
            var value = $("textarea[ui_key=input_c]").val().trim();
            var res = null;
            (function(){
                res = CryptoJS.SHA256(value).toString(CryptoJS.enc.Hex);
            })();
            $("textarea[ui_key=result_c]").val(res);
        });
    })();
    (function(){
        $("div[ui_key=btn_d]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_d]").val("");
            var value = $("textarea[ui_key=input_d]").val().trim();
            var res = value.toUpperCase();
            $("textarea[ui_key=result_d]").val(res);
        });
    })();
    (function(){
        $("div[ui_key=btn_e]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_e]").val("");
            var value = $("textarea[ui_key=input_e]").val().trim();
            var res = value.toLowerCase();
            $("textarea[ui_key=result_e]").val(res);
        });
    })();
    // raw keyup
    (function(){
        $("textarea[ui_type=raw_zone]").on("keyup", (event)=>{
            var targetElem = $(event.currentTarget);
            var ui_key = targetElem.attr("ui_key");
            if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            var keyCode = event.keyCode;
            if("13" == keyCode) {
                targetElem.parent().parent().find("div[ui_type=button]").click();
            } else {
                durationTimer[ui_key] = setTimeout(function(){
                    targetElem.parent().parent().find("div[ui_type=button]").click();
                }, 8000);
            }
        });
    })();
    // AES Encrypt
    (function(){
        $("div[ui_key=btn_aes_encrypt]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_aes_encrypt]").val("");
            var value = $("textarea[ui_key=input_aes_encrypt]").val().trim();
            var privateKey = $("input[ui_key=aes_encrypt_key]").val().trim();
            var res = encrypt_AES_256(value, privateKey);
            $("textarea[ui_key=result_aes_encrypt]").val(res);
        });
        function encrypt_AES_256(content, privateKey) {
            var tmpStr = CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Hex); // SHA-256
            var key = CryptoJS.enc.Utf8.parse(tmpStr.substr(0, 32)); // 0-32 char
            var iv = CryptoJS.enc.Utf8.parse(tmpStr.substr(32, 48)); // 32-48, length need 16.
            // var options = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
            var options = { iv: iv, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.Pkcs7 };
            var encrypt = CryptoJS.AES.encrypt(content, key, options);
            var base64str = url_safe_withoutPadding( encrypt.toString() );
            return base64str;
        }
        function url_safe_withoutPadding(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        }
    })();
    // AES Decrypt
    (function(){
        $("div[ui_key=btn_aes_decrypt]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_aes_decrypt]").val("");
            var value = $("textarea[ui_key=input_aes_decrypt]").val().trim();
            var privateKey = $("input[ui_key=aes_decrypt_key]").val().trim();
            var res = decrypt_AES_256(value, privateKey);
            $("textarea[ui_key=result_aes_decrypt]").val(res);
        });
        function decrypt_AES_256(content, privateKey) {
            var tmpStr = CryptoJS.SHA256(privateKey).toString(CryptoJS.enc.Hex); // SHA-256
            var key = CryptoJS.enc.Utf8.parse(tmpStr.substr(0, 32)); // 0-32 char
            var iv = CryptoJS.enc.Utf8.parse(tmpStr.substr(32, 48)); // 32-48, length need 16.
            // var options = { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
            var options = { iv: iv, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.Pkcs7 };
            var encrypted = decode_url_safe(content);
            var decrypt = CryptoJS.AES.decrypt(encrypted, key, options);
            var res = CryptoJS.enc.Utf8.stringify(decrypt);
            return res;
        }
        function decode_url_safe(str) {
            return str.replace(/-/g, '+').replace(/_/g, '/');
        }
    })();
    // HmacSHA256
    // https://jsfiddle.net/jStefano/gm7boy2p/
    (function(){
        $("div[ui_key=btn_hmac_sha256]").on("click", (event)=>{
            (function(){
                var targetElem = $(event.currentTarget);
                var ui_key = targetElem.parent().parent().find("textarea[ui_type=raw_zone]").attr("ui_key");
                if(null != durationTimer[ui_key]) clearTimeout(durationTimer[ui_key]);
            })();
            $("textarea[ui_key=result_hmac_sha256]").val("");
            var value = $("textarea[ui_key=input_hmac_sha256]").val().trim();
            var secret = $("input[ui_key=hmac_sha256_secret]").val().trim();
            var b64str = null;
            (function(){
                var hash = CryptoJS.HmacSHA256(value, secret);
                b64str = url_safe_withoutPadding( CryptoJS.enc.Base64.stringify(hash) );
            })();
            $("textarea[ui_key=result_hmac_sha256]").val(b64str);
        });
        function url_safe_withoutPadding(str) {
            return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        }
    })();
    // Random String Generate
    (function(){
        $("div[ui_key=btn_random_str]").on("click", function(){
            var len = $("input[ui_key=random_str_length]").val();
            // default is 8 length
            if(null == len || len.length == 0) {
                len = 8;
            }
            $("textarea[ui_key=result_random_str]").val(genRandomStr(len));
        });
        function genRandomStr(len) {
            var arr = [];
            (function(){
                arr.push("0123456789");
                arr.push("abcdefghijklmnopqrstuvwxyz");
                arr.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            })();
            var t = arr.join("");
            var r = [];
            var l = 16; // default
            var tLen = t.length;
            if(null != len) l = len;
            for(var i = 0; i < l; i++) {
                var c = t.charAt( Math.floor( Math.random() * tLen ) );
                r.push(c);
            }
            return r.join("");
        }
    })();
    // json editor
    // https://github.com/josdejong/jsoneditor/blob/master/docs/api.md
    (function(){
        var left_editor = null;
        var right_editor = null;
        (function(){
            var container = $("div[ui_key=json_editor_txt]")[0];
            var options = {
                mode: 'text',
                modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
                onModeChange: function (newMode, oldMode) {
                    console.log('Mode switched from', oldMode, 'to', newMode);
                }
            };
            var json_obj = {
                "array": [1, 2, 3],
                "boolean": true,
                "null": null,
                "number": 123,
                "object": {"a": "b", "c": "d"},
                "string": "Hello World"
            };
            left_editor = new JSONEditor(container, options, json_obj);
        })();
        (function(){
            var container = $("div[ui_key=json_editor_json]")[0];
            var options = {
                mode: 'tree',
                modes: ['code', 'form', 'text', 'tree', 'view', 'preview'], // allowed modes
                onModeChange: function (newMode, oldMode) {
                    console.log('Mode switched from', oldMode, 'to', newMode);
                }
            };
            var json_obj = {
                "array": [1, 2, 3],
                "boolean": true,
                "null": null,
                "number": 123,
                "object": {"a": "b", "c": "d"},
                "string": "Hello World"
            };
            right_editor = new JSONEditor(container, options, json_obj);
            // force set width of input
            $(".jsoneditor-frame").find("input").css("width", "85px");
            // expandAll
            // Expand/collapse a given JSON node. Only applicable for mode 'tree', 'view' and 'form'.
            right_editor.expandAll();
        })();
        (function(){
            $("div[ui_key=btn_parse_json]").on("click", function(){
                right_editor.set(left_editor.get());
                right_editor.setMode("tree");
                right_editor.expandAll();
            });
        })();
        (function(){
            $("div[ui_key=btn_txt_json]").on("click", function(){
                left_editor.set(right_editor.get());
                left_editor.setMode("text");
            });
        })();
    })();
    // to source code page
    (function(){
        $("div[ui_key=to_source_code_page]").on("click", function(){
            window.open(
                "https://github.com/13477940/13477940.github.io",
                "_blank" // new tab
            );
        });
    })();
})();
