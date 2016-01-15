var _$$base = {
    _$init: function () {
            if(!Array.prototype.filter) {
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
            }
        if(!window.XMLHttpRequest) {
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
    }
};
_$$base._$init();