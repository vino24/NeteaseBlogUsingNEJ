/**
 * ----------------------
 * 作业一index页面实现文件
 * @version 1.0
 * @author hzliuguoqing@corp.netease.com
 * ----------------------
 */
var f = function () {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut'),
        _pp = _('util.index'),
        _pro;

    var _dailyId = "fks_0", //  个人日志id
        _dataSelf = [], // 个人日志数据
        _isExist = -1, // 日志是否新建标识
        _editorIndex = -1, // 当前编辑位置
        _ediotrItem = {},
        _operateIndex = -1; // 当前操作位置

    /**
     * index页面
     * @class index页面
     */
    _pp._$$Index = NEJ.C();
    _pro = _pp._$$Index.prototype;

    /**
     * 页面初始化
     * @return {Void}
     */
    _pro.__init = function () {
        var _parent = _e._$get('j-content'),
            _btns = _e._$getByClassName(_parent, 'j-button'),
            _daily = _e._$getByClassName(_parent, 'm-daily')[0],
            _flags = _e._$getByClassName(_daily, 'j-flag');

            this.__pub = _btns[0],
            this.__cl = _btns[1],
            this.__slt = _btns[2],
            this.__dltall = _btns[3],
            this.__daily = _daily,
            this.__tt = _flags[0],  //  日志标题
            this.__ct = _flags[1],   //   日志内容
            this.__list = _flags[2],
            this.__tag = _flags[3],
            this.__flist = _e._$get('j-lst2'),
            this.__url = '../API/xhr.json';


        // init tab
        this.__tab = _e._$tab(_e._$get('tab1'), {
            index: 0,
            event: 'click',
            selected: 'z-slt',
            onchange: function (_event) {
                if (_event.index == 0) {
                    _e._$delClassName(this.__daily, "z-hide");
                    _e._$addClassName(this.__tag, "z-hide");
                } else {
                    _e._$delClassName(this.__tag, "z-hide");
                    _e._$addClassName(this.__daily, "z-hide");
                }
            }._$bind(this)
        });

        //  解析jst模板
        _e._$parseTemplate('templates');

        //  获取个人日志
        this.__sendXHR({
            onload: this.__cbSelf._$bind(this)
        }, "../API/getblogs.json");
        //  获取好友日志
        this.__sendXHR({
            onload: function (_data) {
                this.__render(_data, 1);
            }._$bind(this)
        }, "../API/getfriends.json");

        //  init event
        _v._$addEvent(this.__pub, "click", this.__publish._$bind(this));
        _v._$addEvent(this.__cl, "click", this.__clear._$bind(this));
        _v._$addEvent(this.__list, "click", this.__operate._$bind(this));
        _v._$addEvent(this.__slt, "click", this.__selectAll._$bind(this));
        _v._$addEvent(this.__dltall, "click", this.__deleteAll._$bind(this));
        _v._$addEvent(this.__flist, "mouseover", function () {clearInterval(_intvl);
        });
        _v._$addEvent(this.__flist, "mouseout", function () {_intvl = setInterval(this.__scroll._$bind(this), 2000);}._$bind(this));
        _intvl = setInterval(this.__scroll._$bind(this), 2000); //  滚动计时器
    };

    /**
     * XHR发送函数
     * @param {_obj} 参数对象
     * @param {_url} 请求的url
     */
    _pro.__sendXHR = function (_obj, _url) {
        _j._$request(_url || this.__url, {
            sync: false,
            type: 'json',
            data: _obj.data || null,
            method: _obj.method || 'GET',
            timeout: 3000,
            onload: _obj.onload,
            onerror: this.__onError._$bind(this)
        });
    };

    /**
     * XHR请求异常处理
     */
    _pro.__onError = function () {
        alert('Operate Failure!');
    };

    /**
     * 发布
     */
    _pro.__publish = function () {
        var _tt = _u._$escape(this.__tt.value),
            _ct = _u._$escape(this.__ct.value),
            _date = _u._$format(new Date(), 'yyyy-MM-dd'),
            _time = _u._$format(new Date(), 'HH:mm:ss');
        //  新建日志
        if (_isExist == -1) {
            if (_tt && _ct) {  // 检测是否输入内容
                _ediotrItem = this.__createItem(_dailyId, _tt, _ct, _date, _time);
                this.__sendXHR({
                    data: _ediotrItem,
                    method: "POST",
                    onload: this.__cbNew._$bind(this)
                });
            } else alert("Please input something...");
        }
        //  编辑日志
        else {
            _ediotrItem = this.__updateItem(_dataSelf[_editorIndex], _tt, _ct, _date, _time);
            this.__sendXHR({
                data: _ediotrItem,
                method: "POST",
                onload: this.__cbEdt._$bind(this)
            });
        }
        //  清空日志编辑框
        this.__clear();
    };

    /**
     * 个人日志操作
     * @param {_e} 触发事件的元素
     */
    _pro.__operate = function (_event) {
        //  获取当前操作项索引
        var _getIndex = function (_data, _id) {
            var _index;
            for (var i = 0, l = _data.length; i < l; i++) {
                if (_data[i].id == _id) {
                    _index = i;
                }
            }
            return _index;
        };

        var _currentTarget = _v._$getElement(_event),
            _type = _e._$dataset(_currentTarget, "type"),
            _item = _v._$getElement(_event, function (_elt) {
                return _e._$dataset(_elt, 'id');
            }),
            _id = _e._$dataset(_item, 'id');
        _operateIndex = _getIndex(_dataSelf, _id);
        switch (_type) {
            //  删除操作
            case "dlt":
                this.__sendXHR({
                    data: _dataSelf[_operateIndex].id,
                    onload: this.__cbDlt._$bind(this)
                });
                break;
            /*   置顶操作
             *   通过拆分置顶和取消置顶操作来解决JavaScript中if-else无块级作用域导致rank字段值错误进而导致操作异常的问题
             * */
            case "top":
                this.__sendXHR({
                    data: _dataSelf[_operateIndex].id,
                    onload: this.__cbTop._$bind(this)
                });
                break;
            //  取消置顶操作
            case "cancel":
                this.__sendXHR({
                    data: _dataSelf[_operateIndex].id,
                    onload: this.__cbCl._$bind(this)
                });
                break;
            //   编辑操作
            case "editor":
                this.__tt.value = _dataSelf[_operateIndex].title;
                this.__ct.value = _dataSelf[_operateIndex].blogContent;
                _isExist = 1;    //  更改日志标识
                _editorIndex = _operateIndex;   //  存储当前操作项位置
                break;
            //   选择操作
            default :
                _dataSelf[_operateIndex].isChecked = !_dataSelf[_operateIndex].isChecked;

                //  检查是否选择所有选项，是则更新_sltAllBtn状态
                var _checked = _dataSelf.filter(function (_item) {
                    return _item.isChecked == true;
                });
                if (_checked.length == _dataSelf.length) this.__slt.checked = true;
                else this.__slt.checked = false;
                break;
        }
    };

    /**
     * 全选函数
     */
    _pro.__selectAll = function () {
        if (this.__slt.checked) {
            _u._$forEach(_dataSelf, function (_item) {
                _item.isChecked = true;
            });
        } else {
            _u._$forEach(_dataSelf, function (_item) {
                _item.isChecked = false;
            });
        }
        this.__render(_dataSelf);
    }

    /**
     * 删除选中函数
     */
    _pro.__deleteAll = function () {
        var _checked = [];
        for (var i = 0; i < _dataSelf.length; i++) {
            if (_dataSelf[i].isChecked) {
                _checked.push(_dataSelf[i].id);
                _dataSelf.splice(i, 1);
                i--;    //  索引减1
            }
        }
        this.__sendXHR({
            data: _checked.join('&'),
            onload: this.__cbDltAll._$bind(this)
        });
    };

    /*
     *   新建一条个人数据
     *   @param {id} 日志id,{title} 日志标题,{blogContent} 日志内容,{shortPublishDateStr} year-mouth-day,{publishTimeStr} hour-minute-second,
     *          {allowView} 私人日志标识,{accessCount} 浏览量,{commentCount} 评论数,{isChecked} 选中标识，{rank} 置顶标识
     *   @return {object}  单条日志数据
     */
    _pro.__createItem = function (_id, _title, _blogContent, _shortPublishDateStr, _publishTimeStr) {
        var _item = {};
        _item.id = _id;
        _item.title = _title;
        _item.blogContent = _blogContent;
        _item.shortPublishDateStr = _shortPublishDateStr;
        _item.publishTimeStr = _publishTimeStr;
        _item.allowView = -100;
        _item.accessCount = 0;
        _item.commentCount = 0;
        _item.isChecked = false;
        _item.rank = 0;
        return _item;
    }

    /*
     *   更新一条个人数据
     *   @param {title} 日志标题,{blogContent} 日志内容,{shortPublishDateStr} year-mouth-day,{publishTimeStr} hour-minute-second
     *   @return {object}  单条日志数据
     */
    _pro.__updateItem = function (_item, _title, _blogContent, _shortPublishDateStr, _publishTimeStr) {
        _item.title = _title;
        _item.blogContent = _blogContent;
        _item.shortPublishDateStr = _shortPublishDateStr;
        _item.publishTimeStr = _publishTimeStr;
        return _item;
    };

    /**
     * 个人日志回调
     * @param {_data} 个人日志数组
     */
    _pro.__cbSelf = function (_data) {
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun /*, thisArg */) {
                if (this === undefined || this === null)
                    throw new TypeError();
                var t = Object(this);
                var len = t.length;
                if (typeof fun !== "function")
                    throw new TypeError();
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : undefined;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];
                        if (fun.call(thisArg, val, i, t))
                            res.push(val);
                    }
                }
                return res;
            };
        }
        //  置顶日志
        var _top = _data.filter(function (_item) {
            return _item.rank == 5;
        });
        //  非置顶日志
        var _normal = _data.filter(function (_item) {
            return _item.rank == 0;
        });
        _dataSelf = _top.concat(_normal);
        this.__render(_dataSelf);
    };


    /**
     * 渲染函数
     * @param {_data} 日志数组
     */
    _pro.__render = function (_data) {
        var _obj = {};
        _obj.items = _data;
        if (arguments.length === 1) _e._$renderHtmlTemplate('j-lst', 'dataSelfTemplate', _obj);
        else _e._$renderHtmlTemplate('j-lst2', 'dataFriendTemplate', _obj);
    };

    _pro.__cbNew = function (_result) {
        if (_result.code == 200) {
            _dataSelf.push(_ediotrItem);
            _dailyId++;
            this.__render(_dataSelf);
        }
    };
    _pro.__cbEdt = function (_result) {
        if (_result.code == 200) {
            _dataSelf[_editorIndex] = _ediotrItem;
            _isExist = -1;
            this.__render(_dataSelf);
        }
    };
    _pro.__cbDlt = function (_result) {
        if (_result.code == 200) {
            _dataSelf.splice(_operateIndex, 1);
            this.__clear();
            this.__render(_dataSelf);
        }
    };
    _pro.__cbDltAll = function (_result) {
        if (_result.code == 200) {
            this.__render(_dataSelf);
            this.__clear();
            this.__slt.checked = false;
        }
    };
    _pro.__cbTop = function (_result) {
        if (_result.code == 200) {
            _dataSelf[_operateIndex].rank = 5;
            _dataSelf[_operateIndex].topPos = _operateIndex;
            _dataSelf = [_dataSelf[_operateIndex]].concat(_dataSelf.slice(0, _operateIndex), _dataSelf.slice(_operateIndex + 1));
            this.__render(_dataSelf);
        }
    };
    _pro.__cbCl = function (_result) {
        if (_result.code == 200) {
            var _flag = ++_dataSelf[_operateIndex].topPos;
            _dataSelf[_operateIndex].rank = 0;
            _dataSelf.splice(_flag, 0, _dataSelf[_operateIndex]);
            _dataSelf.splice(_operateIndex, 1);
            this.__render(_dataSelf);
        }
    };

    _pro.__scroll = function () {
        if (parseInt(_e._$getStyle(this.__flist, 'top')) <= -500) {
            _e._$setStyle(this.__flist, 'top', '0px');
        }
        _e._$slide(this.__flist, 'top:-=60', {
            timing: 'ease-out',
            delay: 0,
            duration: 2
        });
    };
    //  清空日志编辑栏函数
    _pro.__clear = function () {
        this.__tt.value = "";
        this.__ct.value = "";
    };

    /**
     * 排序函数
     * @param {_data} 待排序数组
     * @return 排序后数组
     */
    _pro.__sort = function (_data) {
        _data.sort(function (_a, _b) {
            return parseInt(_b.modifyTime) - parseInt(_a.modifyTime);
        });
    };

    new _pp._$$Index();
};
define(['{lib}util/template/tpl.js',
    '{lib}util/tab/tab.js',
    '{lib}ui/layer/card.wrapper.js',
    '{lib}util/effect/effect.api.js'], f);
