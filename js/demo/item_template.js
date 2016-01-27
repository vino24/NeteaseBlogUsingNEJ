/**
 * ------------------------------------------
 * Item 模板
 * @version  2016/1/8
 * @author   hzliuguoqing(hzliuguoqing@corp.netease.com)
 * ------------------------------------------
 */

//  解析Node模板
e._$parseTemplate('friendNodeTemplate');

//  添加名片逻辑
var _friends=[{name:'魏文庆', gender:1, ava:'../image/0.jpg'},
    {name:'严跃杰', gender:1, ava:'../image/1.jpg'},
    {name:'张晓容', ava:'../image/2.jpg'}];
    friendItems= e._$getItemTemplate(_friends,wwq._$$FriendItem,{
        parent:'friends'
    });

//  列表项类wwq._$$FriendItem实现逻辑
var wwq=NEJ.P('wwq');
var pro,supro;
//  好友项
wwq._$$FriendItem=NEJ.C();
pro=wwq._$$FriendItem._$extend(ui._$$Item,!0);
supro=ui._$$Item.prototype;

/**
 * 初始化节点，子类重写具体逻辑
 * @return {Void}
 */
pro.__initNode= function () {
    supro.__initNode.apply(this,arguments);
    var _espans=this.__body.getElementsByTagName('span');
    this.__ecb=this.__body.getElementsByTagName('input')[0];
    this.__eimg=this.__body.getElementsByTagName('img')[0];
    this.__enumber=_espans[0];
    this.__ename=_espans[1];
    this.__egender=_espans[2];
    this.__edelete=this.__body.getElementsByTagName('a')[0];
    v._$addEvent(this.__edelete,'click',this.__onClickDelete._$bind(this));
    v._$addEvent(this.__ecb,'click',this.__onClickCheck._$bind(this));
};

/**
 * 初始化外观信息
 * @return {Void}
 */
pro.__initXGui= function () {
    //  设置节点模板的id，将结构和逻辑关联起来
    this.__seed_html='friendNodeTemplate';
};
/**
 * 刷新项，子类实现具体逻辑
 * @return {Void}
 */
pro.__doRefresh= function (_data) {
    this.__eimg.src=_data.ava;
    this.__enumber.innerHTML=this.__index+1;
    this.__ename.innerText=_data.name;
    this.__egender.innerText=_data.gender?'男':'女';
};
/**
 * 点击删除的响应函数
 * @param {Object} _event 事件对象
 */
pro.__onClickDelete= function (_event) {
    // todo
};
/**
 * 点击复选框的响应函数
 * @param {Object} _event   事件对象
 */
pro.__onClickCheck= function (_event) {
    this.__ecb.checked? e._$addClassName(this.__body,'checked'): e._$delClassName(this.__body,'checked');
};

/**
 * 控件销毁
 * @return {Void}
 */
pro.__destroy= function () {
    supro.__destroy.apply(this,arguments);
    this.__eimg.src='';
    this.__ecb.checked=false;
    e._$delClassName(this.__body,'checked');
};
