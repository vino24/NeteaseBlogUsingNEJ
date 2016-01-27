/**
 * ------------------------------------------
 * 地区选择控件
 * @version  2016/1/8
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */

var f= function () {
    var _  = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _tu = _('t.u'),
        _p = _('nej.ut');

    var _province=_e._$get('province');
    var _city=_e._$get('city');
    var _area=_e._$get('area');

    _v._$addEvent(_province,'change',onProvinceChange._$bind(this));
    _v._$addEvent(_city,'change',onCityChange._$bind(this));
    var _cache=_p._$$RegionCacheZH._$allocate({onlistload:onListLoad});
    _cache._$getList({key:'province'});
    function onListLoad(_option){
        var _key=_option.key.split('-')[0];
        switch (_key){
            case 'province':
                processSelect(_province,_cache._$getListInCache(_option.key));
                onProvinceChange();
                break;
            case 'city':
                processSelect(_city,_cache._$getListInCache(_option.key));
                onCityChange();
                break;
            case 'area':
                processSelect(_area,_cache._$getListInCache(_option.key));
                break;
        }
    }

}