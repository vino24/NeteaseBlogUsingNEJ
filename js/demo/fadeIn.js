/**
 * ------------------------------------------
 *
 * @version  2016/1/25
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f=function(){
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');

    var _e = NEJ.P("nej.e");
    var _node = _e._$get("box");
    _e._$fadeOut(_node,{
        // 注意两位小数可能没有预期效果
        opacity:0.8,
        timing:'ease-out',
        delay:0,
        duration:5
    });
};
define(['{lib}base/global.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}util/effect/effect.api.js'],f);