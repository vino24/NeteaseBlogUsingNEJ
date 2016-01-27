/**
 * ------------------------------------------
 * 表单控件
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f = function () {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j'),
        _p = _('nej.ut');

    //分配表单控件
    var _form = _p._$$WebForm._$allocate({
        form: document.forms[0],
        message: {
            pass: 'ok'
        }
    });
    //提交表单事件
    var _doSubmit = function () {
        if (_form._$checkValidity()) {
            var _data = _form._$data();
            _j._$request('http://nej.netease.com/api/login', {
                method: 'POST',
                type: 'json',
                data: 'username=' + _data.username + '&password=' + _data.password,
                onload: function (_json) {
                    switch (_json.code) {
                        case -1:
                            _form._$showMsgError('password', '密码错误!');
                            return;
                        case -2:
                            _form._$showMsgError('username', '用户名不存在!');
                            return;
                    }
                    alert('提交成功！');
                }
            })
        }
    };
    //添加事件
    _v._$addEvent(_form._$get('btn-ok'), 'click', _doSubmit);
};
define(['{lib}util/form/form.js', '{lib}util/ajax/xdr.js'], f);