/**
 * ------------------------------------------
 * 文件上传
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f= function () {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j');

    //上传出错常量
    var UPLOADERR={
        UNSUPPORT:"不支持的文件类型，仅支持jpg,gif,jpeg,png,bmp图片类型!",
        TOOLARGER:"上传文件太大，不能超2M！",
        UNKNOWERR:"未知原因，上传失败！！"
    };
    //上传文件最大大小
    var UPLOADFILEMAXSIZE=2*1024*1024;

    //  上传文件
    var _doUpload= function (_evt) {
        //  清理并初始化
        _e._$get('preview').src="";
        _e._$get('preview').style.display='';
        _e._$get('uploaderr').innerHTML="";

        //  验证
        _evt=_evt||window.event;
        var _target=_evt.srcElement||-_evt.target;

        //  验证文件格式
        var _src=_target.value;
        var _type=(_src.substr(_src.lastIndexOf(".")+1)).toLowerCase();
        if(!/jpeg|gif|jpg|png|bmp/i.test(_type)) {
            _e._$get('uploaderr').innerHTML=UPLOADERR.UNSUPPORT;
            return;
        }
        //  验证文件大小
        var _size=0;
        if(_target.files) {
            var _file=_target.files[0];
            _size=_file.fileSize?_file.fileSize:_file.size;
        }
        if(_size>UPLOADFILEMAXSIZE) {
            _e._$get('uploaderr').innerHTML=UPLOADERR.TOOLARGER;
            return;
        }
        //  上传文件
        _j._$upload(document.forms['upload-form'],{
            onload: function (_json) {
                if(_json.state=="success"){
                    _e._$get('preview').style.display='block';
                    _e._$get('preview').src=_json.url;
                } else {
                    _e._$get('uploaderr').innerHTML=UPLOADERR.UNSUPPORT;
                }
            },
            onerror: function (err) {
                if(_err.data==413) {
                    _e._$get('uploaderr').innerHTML=UPLOADERR.TOOLARGER;
                }else {
                    _e._$get('uploaderr').innerHTML=UPLOADERR.UNKNOWERR;
                }
            }
        });
    };
    //  视频上传事件
    _v._$addEvent('upload','change',_doUpload);
};
define(['{lib}util/ajax/xdr.js'],f);