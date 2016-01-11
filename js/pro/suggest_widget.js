/**
 * ------------------------------------------
 * 建议提示控件
 * @version  2016/1/8
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f = function(){
    var _  = NEJ.P,
        _e = _('nej.e'),
        _tu = _('t.u'),
        _p = _('nej.ut');

    var _input = _e._$get('input');
    var _sugNode = _e._$get('sug');
    var onChange = (function(){
        var _sufix = ['@163.com','@126.com','@188.com','@vip.163.com','@vip.126.com','@yeah.net'];
        return function(_value){
            var _arr = [];
            nej.u._$forEach(_sufix,function(_name){
                _arr.push('<div class="itm">'+_value+_name+'</div>');
            });
            _sugNode.innerHTML = _arr.join('')
            _suggest._$setList(_e._$getChildren(_sugNode));
        }
    })()
    //参数的选择详见tab.js
    var _suggest = _p._$$Suggest._$allocate({
        body:_sugNode,
        input: _input,
        clazz:'sug',
        onchange: onChange,
        onselect: onSelect
    });

    function onSelect(_value){
        _input.value = _value;
    }
}
define(['{lib}util/suggest/suggest.js', '{pro}js/extend.js'],f);