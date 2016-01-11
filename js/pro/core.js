var f = function () {
    var _ = NEJ.P,
        _e = _('nej.e'),
        _v = _('nej.v'),
        _j = _('nej.j'),
        _u = _('nej.u'),
        _p = _('nej.ut');
    //  _dailyId 个人日志id, _dataSelf 个人日志数据, _dataFriend 好友日志数据,_isExist 日志是否新建标识, _editorIndex 当前编辑位置
    _dailyId = "fks_0", _dataSelf = [], _dataFriend = [], _isExist = -1, _editorIndex = -1,
        _selfKey = _e._$addHtmlTemplate('dataSelfTemplate'), _friendKey = _e._$addHtmlTemplate('dataFriendTemplate');

    var _parent = _e._$get('j-content');

    //  _mTag 标签栏, _mList 个人日志栏, _daily 好友日志栏
    var _mDaily = _e._$getByClassName(_parent, 'm-daily')[0],
        _mTag = _e._$getByClassName(_parent, 'm-tags')[0],
        _mList = _e._$getByClassName(_parent, 'm-list')[0];

    var _daily = _e._$get('daily'),
        _tags = _e._$get('tags'),
        _articles = _e._$getByClassName(_parent, 'articles')[0];

    //   _title 日志标题, _textarea 日志内容
    var _title = _e._$getByClassName(_parent, 'j-title')[0],
        _textarea = _e._$getByClassName(_parent, 'j-content')[0];

    //   _pubBtn 发布按钮, _clearBtn 清空按钮, _sltAllBtn 全选按钮, _dltAllBtn 全删按钮
    var _pubBtn = _e._$getByClassName(_parent, 'j-pub')[0],
        _clearBtn = _e._$getByClassName(_parent, 'j-clear')[0],
        _sltAllBtn = _e._$getByClassName(_parent, 'j-sltall')[0],
        _dltAllBtn = _e._$getByClassName(_parent, 'j-dltall')[0];

    //  页面初始化(<script>标签在<body>后页面元素已经可操作，无需监听window的load事件)
    _init();

    //  页面初始化函数
    function _init() {
        _$$base._$ieFixed(); //  载入ieFixed，消除浏览器差异
        _initData();
        _bindBtns();
        _interval = setInterval(_scroll, 60);  //  好友日志滚动计时器
    }

    function _initData() {
        //  获取个人日志
        _j._$request("../getblogs.json", {
            sync: false,
            type: 'json',
            data: null,
            method: 'GET',
            timeout: 3000,
            onload: _cbSelf
        });
        //  获取好友日志
        _j._$request("../getfriends.json", {
            sync: false,
            type: 'json',
            data: null,
            method: 'GET',
            timeout: 3000,
            onload: _cbFriend
        });
    }

    //  绑定按钮函数
    function _bindBtns() {
        //  绑定日志栏
        _v._$addEvent(_daily, "click", function () {
            if (!_e._$hasClassName(_daily, "selected")) {
                _e._$addClassName(_daily, "selected");
                _e._$delClassName(_tags, "selected");
                _e._$delClassName(_mDaily, "z-hidden");
                _e._$addClassName(_mTag, "z-hidden");
            }
        });
        //  绑定标签栏
        _v._$addEvent(_tags, "click", function () {
            if (!_e._$hasClassName(_tags, "selected")) {
                _e._$addClassName(_tags, "selected");
                _e._$delClassName(_daily, "selected");
                _e._$delClassName(_mTag, "z-hidden");
                _e._$addClassName(_mDaily, "z-hidden");
            }
        });
        //  绑定发布按钮
        _v._$addEvent(_pubBtn, "click", _publish);
        //   绑定清空按钮
        _v._$addEvent(_clearBtn, "click", _clear);
        //  单篇操作
        _v._$addEvent(_mList, "click", _operate);
        //  绑定全选按钮
        _v._$addEvent(_sltAllBtn, "click", _selectAll);
        //  绑定全删按钮
        _v._$addEvent(_dltAllBtn, "click", _deleteAll);
        //  绑定好友日志悬停操作
        _v._$addEvent(_articles, "mouseover", _msOver);
        //  绑定好友日志离开操作
        _v._$addEvent(_articles, "mouseout", _msOut);
    }

    //  发布函数
    function _publish() {
        var _url, _currentIndex/* 记录当前编辑日志在日志列表的位置 */,
            _titleVal = _u._$escape(_title.value),
            _content = _u._$escape(_textarea.value),
            _date = _u._$format(new Date(), 'yyyy-MM-dd'),
            _time = _u._$format(new Date(), 'HH:mm:ss');
        //  新建日志
        if (_isExist == -1) {
            if (_titleVal && _content) {  // 检测是否输入内容
                _dataSelf.push(_createItem(_dailyId, _titleVal, _content, _date, _time));
                _url = "http://192.168.144.11/api/addBlog?blog={" + encodeURIComponent(_dataSelf[_dataSelf.length - 1].title) + encodeURIComponent(_dataSelf[_dataSelf.length - 1].blogContent) + "}";
                _dailyId = _dailyId + 1;
            } else alert("Please input something...");
        }
        //  编辑日志
        else {
            _currentIndex = _editorIndex;
            _dataSelf[_currentIndex] = _updateItem(_dataSelf[_currentIndex], _titleVal, _content, _date, _time);
            _url = "http://192.168.144.11/api/untopBlog?id=" + encodeURIComponent(_dataSelf[_currentIndex].id);
            _isExist = -1;   //  重置日志标识
        }
        // _$$base.sendXHR(_url, "POST");
        _render(_dataSelf);
        //  清空日志编辑框
        _clear();
    }

    //  获取触发事件的日志ID
    function _getDaliyId(_elt, _type) {
        var _id;
        switch (_type) {
            case 'editor':
                _id = _elt.parentNode.parentNode.parentNode.getAttribute("data-id");
                break;
            case "checkbox":
                _id = _elt.parentNode.parentNode.parentNode.getAttribute("data-id");
                break;
            default :
                _id = _elt.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("data-id");
        }
        return _id;
    }

    //  获取当前操作项索引
    function _getIndex(_data, _id) {
        var _index;
        for (var i = 0, l = _data.length; i < l; i++) {
            if (_data[i].id == _id) {
                _index = i;
            }
        }
        return _index;
    }

    //  个人日志操作函数
    function _operate(_e) {
        var _url,
            _currentTarget = _e.target || _e.srcElement,
            _type = _currentTarget.getAttribute("data-type"),
            _id = _getDaliyId(_currentTarget, _type), _index = _getIndex(_dataSelf, _id);

        //  删除操作
        if (_type == "dlt") {
            //_url = "http://192.168.144.11/api/deleteBlogs?id=" + encodeURIComponent(_dataSelf[_index].id);
            //_$$base.sendXHR(_url, "GET");
            _dataSelf.splice(_index, 1);
        }
        /*   置顶操作
         *   通过拆分置顶和取消置顶操作来解决JavaScript中if-else无块级作用域导致rank字段值错误进而导致操作异常的问题
         * */

        else if (_type == "top") {
            _dataSelf[_index].rank = 5;
            _dataSelf[_index].topPos = _index; //  保存日志当前位置
            _dataSelf = [_dataSelf[_index]].concat(_dataSelf.slice(0, _index), _dataSelf.slice(_index + 1));
            //_url = "http://192.168.144.11/api/topBlog?id=" + encodeURIComponent(_dataSelf[_index].id);
            //_$$base.sendXHR(_url, "GET");
        }
        //  取消置顶操作
        else if (_type == "cancel") {
            var _flag = ++_dataSelf[_index].topPos;  //  获取日志之前的位置索引
            _dataSelf[_index].rank = 0;
            _dataSelf.splice(_flag, 0, _dataSelf[_index]);  //  插入pos
            _dataSelf.splice(_index, 1);     //  删除原本的pos
            //_url = "http://192.168.144.11/api/untopBlog?id=" + encodeURIComponent(_dataSelf[_index].id);
            //_$$base.sendXHR(_url, "GET");
        }
        //   编辑操作
        else if (_type == "editor") {
            _title.value = _dataSelf[_index].title;
            _textarea.value = _dataSelf[_index].blogContent;
            _isExist = 1;    //  更改日志标识
            _editorIndex = _index;   //  存储当前操作项位置
        }
        //   选择操作
        else if (_type == "checkbox") {
            _dataSelf[_index].isChecked = (_dataSelf[_index].isChecked == true) ? false : true;

            //  检查是否选择所有选项，是则更新_sltAllBtn状态
            var _checked = _dataSelf.filter(function (_item) {
                return _item.isChecked == true;
            });
            if (_checked.length == _dataSelf.length) _sltAllBtn.checked = true;
            else _sltAllBtn.checked = false;
        }
        _render(_dataSelf);
    }

    //   全选函数
    function _selectAll() {
        if (_sltAllBtn.checked) {
            _u._$forEach(_dataSelf, function (_item) {
                _item.isChecked = true;
            });
        } else {
            _u._$forEach(_dataSelf, function (_item) {
                _item.isChecked = false;
            });
        }
        _render(_dataSelf);
    }

    //  删除选中函数
    function _deleteAll() {
        var _checked = [];
        for (var i = 0; i < _dataSelf.length; i++) {
            if (_dataSelf[i].isChecked) {
                _checked.push(_dataSelf[i].id);
                _dataSelf.splice(i, 1);
                i--;    //  索引减1
            }
        }
        var _url = "http://192.168.144.11/api/deleteBlogs?id=" + encodeURIComponent(_checked.join("&"));
        // _$$base.sendXHR(_url, "GET");
        _render(_dataSelf);
        _sltAllBtn.checked = false;
    }

    /*
     *   新建一条个人数据
     *   @param {id} 日志id,{title} 日志标题,{blogContent} 日志内容,{shortPublishDateStr} year-mouth-day,{publishTimeStr} hour-minute-second,
     *          {allowView} 私人日志标识,{accessCount} 浏览量,{commentCount} 评论数,{isChecked} 选中标识，{rank} 置顶标识
     *   @return {object}  单条日志数据
     */
    function _createItem(id, title, blogContent, shortPublishDateStr, publishTimeStr) {
        var _item = {};
        _item.id = id;
        _item.title = title;
        _item.blogContent = blogContent;
        _item.shortPublishDateStr = shortPublishDateStr;
        _item.publishTimeStr = publishTimeStr;
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
    function _updateItem(_item, title, blogContent, shortPublishDateStr, publishTimeStr) {
        _item.title = title;
        _item.blogContent = blogContent;
        _item.shortPublishDateStr = shortPublishDateStr;
        _item.publishTimeStr = publishTimeStr;
        return _item;
    }

    //  个人日志处理函数
    function _cbSelf(_data) {
        _sort(_data);
        //  置顶日志
        var _top = _data.filter(function (_item) {
            return _item.rank == 5;
        });
        _dataSelf = _top;
        //  非置顶日志
        var _normal = _data.filter(function (_item) {
            return _item.rank == 0;
        });
        _dataSelf = _dataSelf.concat(_normal);
        _render(_dataSelf);
    }

    //  好友日志处理函数
    function _cbFriend(_data) {
        _sort(_data);
        _dataFriend = _data;
        _renderFriend(_dataFriend);
    }

    //  好友日志滚动函数
    function _scroll() {
        _articles.scrollTop++;    //  滚动，scrollTop(被隐藏在内容区域上方的像素数，即滚动条位置)
        //  检测是否滚过一篇日志的距离
        if (_articles.scrollTop % 56 == 0) {
            clearInterval(_interval);    //  立即停止滚动计时器
            //  然后设置2s后执行的计时器，并在计时器内重新开启滚动计时器
            setTimeout(function () {
                _interval = setInterval(_scroll, 60);
            }, 2000);
        }
        //  检测是否滚动到最后，是则重置scrollTop
        if (_articles.scrollTop > 500) {
            _articles.scrollTop = 0;
        }
    }

    //  好友日志鼠标悬停函数
    function _msOver() {
        clearInterval(_interval);
    }

    //  好友日志鼠标远离函数
    function _msOut() {
        _interval = setInterval(_scroll, 60);
    }

    //  渲染个人日志函数
    function _render(_data) {
        var _arr = [], _self = {};
        _u._$forEach(_data, function (_item) {
            if (_item) {
                var isChecked = (_item.isChecked === true) ? 'checked' : ' ',
                    allowView = (_item.allowView == 10000) ? '<span class="s-bg sprite-private"></span>' : '',
                    dataType = (_item.rank == 0) ? 'top' : 'cancel',
                    text = (_item.rank == 0) ? '置顶' : '取消';
                var _obj = {
                    "id": _item.id,
                    "isChecked": isChecked,
                    "allowView": allowView,
                    "title": _item.title,
                    "blogContent": _item.blogContent,
                    "dataType": dataType,
                    "text": text,
                    "shortPublishDateStr": _item.shortPublishDateStr,
                    "publishTimeStr": _item.publishTimeStr,
                    "accessCount": _item.accessCount,
                    "commentCount": _item.commentCount
                };
                _arr.push(_obj);
            }
        });
        _self.selfItems = _arr;
        _tplEngine('j-list', _selfKey, _self);
    }

    //  渲染好友日志函数
    function _renderFriend(_data) {
        var _arr = [], _friend = {};
        _u._$forEach(_data, function (_item) {
            if (_item) {
                var _obj = {
                    "avtor": _item.avtor,
                    "userName": _item.userName,
                    "Content": _item.Content
                };
                _arr.push(_obj);
            }
        });
        _friend.friendItems = _arr;
        _tplEngine('j-articles', _friendKey, _friend);
    }

    /*  模板引擎函数
     *  @param {_parent} 合并后要依附的父元素 {_key} 缓存中的jst字符串  {_data} 需要渲染的数据
     * */
    function _tplEngine(_parent, _key, _data) {
        _e._$getHtmlTemplate(_key, _data);
        _e._$renderHtmlTemplate(_parent, _key, _data);
    }

    //  清空日志编辑栏函数
    function _clear() {
        _title.value = "";
        _textarea.value = "";
    }

    //  排序函数
    function _sort(_data) {
        //  IE6+(无法使用Array.prototype.sort作为判定，IE6有sort函数，但表现与其他浏览器不同)
        if (!_$$base._$isIE6()) {
            _data.sort(function (_a, _b) {
                return parseInt(_b.modifyTime) - parseInt(_a.modifyTime);
            });
        }
        //  IE6
        else {
            var _a, l = _data.length;
            for (var i = 0; i < l; i++) {
                for (j = i + 1; j < l; j++) {
                    if (parseInt(_data[i].modifyTime) < parseInt(_data[j].modifyTime)) {
                        _a = _data[i];
                        _data[i] = _data[j];
                        _data[j] = _a;
                    }
                }
            }
        }
    }
};
define(['{lib}util/template/tpl.js'], f);
