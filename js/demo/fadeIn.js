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
    var _effect=_p._$$Effect._$allocate({
        node:'box',
        transition:[{
            property:'top',
            timing:'ease-in',
            delay:2,
            duration:10
        }],
        styles:['top:+=300']
    });
    _effect._$start();
};
define(['{lib}base/global.js',
    '{lib}base/event.js',
    '{lib}base/util.js',
    '{lib}util/effect/effect.api.js'],f);