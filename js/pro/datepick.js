/**
 * ------------------------------------------
 * 日历控件demo
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f= function () {
    var _=NEJ.P,
        _e=_('nej.e'),
        _v=_('nej.v'),
        _j=_('nej.j'),
        _u=_('nej.u'),
        _p=_('nej.ui');
    var _input=_e._$get('datepick');
    _v._$addEvent(_input,'click',onInputClick);

    function onInputClick(_event) {
        _v._$stop(_event);  //  阻止默认事件
        var _datepick = _p._$$DatePick._$allocate({
            parent: _input.parentNode,
            clazz: 'm-dt',      //通过这个样式改变日历控件的表现
            onchange: onChange
        });
    }
    //  选中时回调，把值设置到input中
    function onChange(_value) {
        _input.value=_u._$format(_value,'yyyy-MM-dd');
    }
};
define(['{lib}ui/datepick/datepick.js'],f);