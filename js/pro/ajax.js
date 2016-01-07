/**
 * ------------------------------------------
 * Ajax
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f= function () {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j');

    var _lastIndex=0;
    //  ajax回调函数
    var _cbShowAjaxData= function (_data) {
        var _cnt=_e._$get('cnt');
        _cnt.innerHTML='';
        var _len=_data.length;
        for(var i=(_lastIndex>=_len?(_lastIndex=0):_lastIndex),l=(i+5<_len?i+5:_len);i<l;i++){
            var _tempP=_e._$create("p",null,_cnt);
            _tempP.innerHTML="title:"+_data[i].title+"<br/>"+_data[i].shortPublishDateStr+" "
            +_data[i].publishTimeStr+" 访问"+_data.accessCount+" 评论"+_data[i].commentCount;
        }
        _lastIndex+=5;
    };
    //  bntClick响应函数
    var onBntClick= function (event) {
        //  ajax请求数据
        _j._$request("http://nej.netease.com/api/getFriendsLatestBlogs",{
            sync:false,
            type:"json",
            data:null,
            query:"userid=125770605",
            methond:"GET",
            onload:_cbShowAjaxData
        });
    };
    //  添加事件
    _v._$addEvent(_e._$get('bnt'),'click',onBntClick);
};
define(['{lib}util/ajax/xdr.js'],f);