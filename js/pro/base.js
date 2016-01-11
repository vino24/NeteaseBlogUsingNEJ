var _$$base = {
    /*
    *   处理浏览器兼容性方法
    * */

    //  检测是否为IE6
    _$isIE6: function(){
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE 6]><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
    },
    /*
    * IE function rewrite
    *   include:filter、forEach、indexOf、XMLHttpRequest
    */
    _$ieFixed: function () {
        if (!!window.ActiveXObject) {   //  检测是否为IE浏览器
            Array.prototype.filter = function (fun /*, thisArg */) {
                "use strict";
                if (this === void 0 || this === null)
                    throw new TypeError();
                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun !== "function")
                    throw new TypeError();
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];
                        if (fun.call(thisArg, val, i, t))
                            res.push(val);
                    }
                }
                return res;
            };

            window.XMLHttpRequest = function () {
                try {
                    //  ActiveX对象新版本
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                }
                catch (e1) {
                    try {
                        //  ActiveX对象旧版本
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    }
                    catch (e2) {
                        throw new TypeError("XMLHttpRequest is not supported");
                    }
                }
            };
        }
    } /*  不能留"," IE8-报错 */
};
