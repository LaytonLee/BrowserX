// ==UserScript==
// @name         web page cleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  清理常用网站的推广信息
// @description  由于知乎对其页面使用了 Content-Security-Policy，且由于safari的限制，safari中无法使用知乎部分的优化
// @author       layton
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *://*.csdn.net/*
// @match        *://*.zhihu.com/*
// @match        *://*.bilibili.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAiCAYAAABbXymAAAAACXBIWXMAAAPYAAAD 2AFuR2M1AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA7RJ REFUSIm11l+IVFUcwPHv79wzd+/s7L07K8OuioWhKQlBtaQEPkQPkg8VgqHmg/15 MfChCHoQeu4pDCIJo0hQ2UIqkgR1pSXojz2YDFo4ySbuiuLsts7M7uzszJzz66Hd dZddLW38PV04v/Phd37n3HOvqCr3I8y/JRzLy0P9Z4N9A2dkRcvggcsSichRZ/zr 3vJsy+AbU3zgjA47w3kHV+aO/Xpa1oHIXcOHBu0rTnhGM+xy8KCGt+D8ScmQ4scL A3Lhj1Oy4z/D+y/LY01x7znDizdGqXsrOZShmfGJmO0ukD/VyJcukAODp0z/WL90 3hE+feXdddZ2nFiuu8+v9xf3bYi/GUQ6WRldHC8UClooFEoSPrI/zLzVnur5LSe5 g+84Y1fcbPDJXMfOPBQKhc0q+vb1dP/TUzJO2fzeXZKfgQZGls9OqLvzSV2H6Grf uUaQNUQb0GVfeT/8/NpLZz/aufqJ3YcBbD6fz6TT6c+ArRejA1TsEOsnjnDVHiEf vka6GdOlvbNw2X1BFL6A0D6nvIeNS3VjbOZQoVB4Lo7jV20URe+r6tbrbT9xIfMx m8Y+J3ar6HK91ORNLgV7sbIUFDzjlPwxHgj7FuyLN02QEGBbpVIpGWA7QLtbxsby h8Ru1WxypCuw0k2KpQDc1GPYYC2hWTsfbV6mqSVIrQZARHYYa60CJM2V9NQ3LKik aq4STve4SB+dwbYFOY2poxA9BSYGIAgCNdlstmyMue2F0ZQmoS6jwjlqco1ENs8f d4NMTh0m6NgNgDFGs9lsxVhrr+VyuYl0Ot1YDH6y1kesjzIWfE/dTDDEXir6HXU/ SLV5nNHqy6SilwjCXtLpdCOXy01Ya69JqVQ6DmwE8N5LrVaz9XrdNhqNwDk375Ut yxlG6KPaHCDlJmlzMT1te3xPdk89itLNOSv/Qcrl8kFV3bJYtaoqzjnx3ov3XmaW qlJDpaxtttsL4YJ5IvK19d4X5TZ3iYjozObOjxBIFp0zHSMGKN4p4x6jaFS15bD3 ftQEQdByWFWLRlVv3Ad45L60wlpbNJ2dnS2vmOlTMS4iky1EXRzHYwb+6UkL4b8A NwO3ss9FmP7mGWNa1mcRuQW3uOKRWRhoWcXe+1uw937ozul3FaNz4ZMiUmuFKiL5 WXjJkiXDqvoG4P+neyZJkhOzMECSJEdEZDNw7h7AJvBpkiRbAAcgi/14V6vVxxuN xiZjTK+qrgZyIpJR1RRwU0SqqjoMFETkFxH5tqOjY97J+huvtpXCworV2wAAAABJ RU5ErkJggg==
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    allCleaner();

    /**
     * 根据域名加载对应的cleaner
     */
    function allCleaner() {
        let domain = window.location.hostname;
        // 获取主域名
        let mainDomain = getMainDomain(domain);

        switch(mainDomain) {
            case "csdn.net":
                csdnCleaner();
                break;
            case "zhihu.com":
                zhihuCleaner();
                break;
            case "bilibili.com":
                bilibiliCleaner();
                break;
        }
    }

    /**
    * 获取主域名
    */
    function getMainDomain(domain) {
        let re = new RegExp(/[\w]+\.((com\.cn)|(org\.cn)|(net\.cn)|com|net|org|gov|cc|biz|info|cn|co)/g);
        let mainDomain = domain.match(re)[0];
        return mainDomain;
    }

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
            .toolbar-advert {
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

    /**
    * bilibili.com cleaner
    */
    function bilibiliCleaner() {
        GM_addStyle(`
            .v-popover-content{
                height: 0;
                visibility: hidden;
            }
            .login-tip {
                height: 0;
                visibility: hidden;
            }
            .bili-header
            .bili-header__banner{
                min-height: 60px;
                height: 60px;
                min-height: 60px;
            }
            .animated-banner{
                height: 0;
                visibility: hidden;
            }
            .header-banner__inner{
                height: 0;
                visibility: hidden;
            }
            .taper-line{
                height: 0;
                visibility: hidden;
            }
            .default-entry span{
                color: black;
            }
            .bili-header .right-entry .right-entry-item .right-entry-text {
                color: black;
            }
            .right-container{
                width: 0;
                visibility: hidden;
            }
            #activity_vote {
                height: 0;
                visibility: hidden;
            }

        `);

        // 关闭推荐列表自动播放
        let recListAutoPlayOff = setInterval(()=> {

            if ($("span.switch-button") != undefined && $("span.switch-button").className == "switch-button") {
                window.clearInterval(recListAutoPlayOff);
            } else {
                if ($("span.switch-button") != undefined) {
                    $("span.switch-button").click();
                }
            }
        }, 800)

        // 播放器自动宽屏
        let playerAutoWideOn = setInterval(() => {
            if ( $("div.bpx-player-container.bpx-state-no-cursor") != undefined && $("div.bpx-player-container.bpx-state-no-cursor").attr("data-screen") == "wide" ) {
                window.clearInterval(playerAutoWideOn);
            } else {
                if( $("div.bpx-player-ctrl-btn.bpx-player-ctrl-wide") != undefined ) {
                    $("div.bpx-player-ctrl-btn.bpx-player-ctrl-wide").click();
                }
            }
        }, 800);

    }
})();