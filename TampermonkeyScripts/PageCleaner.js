// ==UserScript==
// @name         web page cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清理常用的网站推广，
// @description  由于知乎对其页面使用了 Content-Security-Policy，且由于safari的限制，safari中无法使用知乎不分的优化
// @author       layton
// @require      tampermonkey://vendor/jquery.js
// @match        *://*.csdn.net/*
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    csdnCleaner();
    zhihuCleaner();

    /**
    *  csdn cleaner
    */
    function csdnCleaner() {
        GM_addStyle(`
            pre, code {
                user-select: auto !important;
            }
            #blogExtensionBox,
            .hide-article-box,
            .insert-baidu-box,
            .signin,
            .wwads-horizontal,
            .wwads-vertical,
            .blog-top-banner,
            .blog_container_aside,
            .programmer1Box,
            .recommend-box,
            .recommend-nps-box,
            .template-box,
            .hide-preCode-box {
                display: none !important;
            }
            main {
                width: 100% !important;
            }
            #article_content,
            main div.blog-content-box pre.set-code-hide {
                height: auto !important;
            }
            .csdn-common-logo-advert {
                visibility: hidden;
            }
        `);
        // 删除暗黑皮肤样式
        $("link").each((index, item) => {
            if ($(item).attr("href").indexOf("skin") > -1) {
                $(item).remove();
            }
        });

        // 免登录复制
        $(".hljs-button").removeClass("signin");
        $(".hljs-button").attr("data-title", "免登录复制");
        $(".hljs-button").attr(
            "onclick",
            "hljs.copyCode(event);setTimeout(function(){$('.hljs-button').attr('data-title', '免登录复制');},3500);"
        );
        // 去除剪贴板劫持
        $("code").attr("onclick", "mdcp.copyCode(event)");
        try {
            Object.defineProperty(window, "articleType", {
                value: 0,
                writable: false,
                configurable: false,
            });

            csdn.copyright.init("", "", "");
        } catch (err) {}
    }

    /**
    * zhihu cleaner
    * 在safari中无法生效，详情：https://github.com/Tampermonkey/tampermonkey/issues/296
    */
    function zhihuCleaner() {
        let signinHandler = setInterval(()=>{
            // window.console.log(window.location.href);

            if(document.getElementsByClassName("Button Modal-closeButton Button--plain")[0] != null) {
                document.getElementsByClassName("Button Modal-closeButton Button--plain")[0].click();

                window.clearInterval(signinHandler);
            }
        }, 500)
    }
})();