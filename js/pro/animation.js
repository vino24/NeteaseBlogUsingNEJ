/**
 * ------------------------------------------
 * 动画
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f=function(){
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _p = _('nej.ut');

    var _ac = _p._$$AnimBounce._$allocate({from:{offset:70,velocity:1000},acceleration:500,springtension:0.5,onstop:_onBounceStop,onupdate:_onBounceUpdate})

    function _onBounceStop(_offset){
        //todo
    }
    function _onBounceUpdate(_offset){
        _e._$get('ball').style.left = _offset.offset +'px';
    }

    _v._$addEvent(_e._$get('bnt2'),'click',_onBnt2Click._$bind(this));
    function _onBnt2Click(event){
        _ac._$play();
    };
};
define(['{lib}util/animation/bounce.js'],f);