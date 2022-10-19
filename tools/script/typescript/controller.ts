// namespace define
var moment: any = window.moment || null;

// site function
(function(){
    // 新增腳本時於此處增加腳本路徑
    var arr: any = [];
    (function(){
        // module script - 基礎功能腳本
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
    // 遞迴方式讀取所有 script 項目
    (function(){
        var tmpPath = null;
        loadNext();
        function loadNext() {
            tmpPath = arr.shift();
            if(null != tmpPath) {
                website.script(tmpPath, function(){
                    loadNext();
                });
            } else {
                scriptReady();
            }
        }
    })();
    // all script ready
    function scriptReady() {
        // 公用腳本準備完成
        if(null == website.ready) {
            console.error("該頁面不具有 window.website.ready 方法，無法完成初始化呼叫");
        } else {
            // 藉由 setTimeout 將執行優先度降低
            setTimeout(function(){
                website.ready();
            }, 1);
        }
    }
})();

// startup
(function(){
    // 各個分頁載入完成後的通用方法可寫於此處，差異化方法則寫在個別腳本中
    website["ready"] = function(){
        website["script"]("script/module/index.js", function(){
            console.log("script load ready.");
        });
    };
})();
