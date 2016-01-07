/**
 * ------------------------------------------
 * 模板 Tab选项卡
 * @version  2016/1/7
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f= function () {
    var _=NEJ.P;
    _e=_('nej.e');

    //  解析模板
    _e._$parseTemplate('template-box');

    //  使用tab控件
    _e._$tab('tab-box',{
        index:1,
        onchange: function (_event) {
            var _element=_e._$get('module-box');
            switch (_event.index) {
                case 0:
                    _element.innerHTML=_e._$getHtmlTemplate('mdl-tab-0',{xlist:new Array(6)});
                    break;
                case 1:
                    _element.innerHTML='';
                    _element.appendChild(_e._$getNodeTemplate('mdl-tab-1'));
                    break;
                case 2:
                    _element.innerHTML=_e._$getTextTemplate('mdl-tab-2');
                    break;
            }
        }
    })
};
define(['{lib}util/template/tpl.js','{lib}util/tab/tab.js'],f);