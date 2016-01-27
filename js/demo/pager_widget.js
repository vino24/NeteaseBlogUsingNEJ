/**
 * ------------------------------------------
 * 分页控件
 * @version  2016/1/8
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */
var f = function () {
    var _ = NEJ.P,
        _p = _('nej.ui'),
        _e = _('nej.e'),
        _proPager;

    var _seed_css = _e._$pushCSSText('');
    var _seed_html=_e._$addNodeTemplate('');
    _p._$$pager = NEJ.C();
    _proPager = _p._$$pager._$extend(_p._$$Abstract, !0);

    /**
     * 初始化外观信息
     * @return {Void}
     */

    _proPager.__initXGui = function () {
        this.__seed_css = _seed_css;
        this.__seed_html=_seed_html;
    };

    /**
     * 初始化节点
     * @return {Void}
     */
    _proPager.__initNode= function () {
        this.__supInitNode();
        var _seed=_e._$getHtmlTemplateSeed();
        this.__popt.list=_e._$getByClassName(this.__body,'js-i-'+_seed);
        this.__popt.pbtn=(_e._$getByClassName(this.__body,'js-p-'+_seed)||_r)[0];
        this.__popt.nbtn=(_e._$getByClassName(this.__body,'js-n-'+_seed)||_r)[0];
    };

    /**
     * 动态构建控件节点模板
     * @return {Void}
     */
    _proPager.__initNodeTemplate= function () {
        _seed_html=_e._$addNodeTemplate('<div class="'+this.__seed_css+'">'
        +this.__doGenPageListXhtml({number:9})+'</div>');
    };

    /**
     * 控件重置
     * @param {Object} _options 可选配置参数
     * @return {Void}
     */
    _proPager.__reset= function (_options) {
        this.__supReset(_options);
        this.__popt.total=_options.total;
        this.__popt.index=_options.index;
        this.__page=_t._$$Page._$allocate(this.__popt);
    };

    /**
     * 控件销毁
     * @return {Void}
     */
    _proPager.__destroy= function () {
        this.__supDestroy();
        this.__page=this.__page._$recycle();
        this._$unbind();
    }
};