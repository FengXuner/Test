/**
 * @class   MessageCache
 * @info    网络消息缓存
 *            缓存不用更新的消息
 * @author  baofeng
 * @date    2018-10-10
 */

/* 局部变量 */
let _handler = null;
let _msgCache = {};
let _filterOnce = null;
let _filterNewDay = null;
let _needCache = {};
let _dseTypes = {};
let _ready = false;

/* 局部函数 */
// function onNewDay () {
//
// }

function init () {
    if (_ready) {
        return;
    }
    _ready = true;

    _filterOnce = {};
    _filterNewDay = {};

    for (let key in _filterOnce) {
        _needCache[_filterOnce[key]] = true;
    }

	for (let key in _filterNewDay) {
		_needCache[_filterNewDay[key]] = true;
	}

	///TODO: 注册跨天处理
	// NetMessageSystem.registerMessageListener(ID_DseSetNewDay, onNewDay, PRIORITY_LEVEL.HIGH);
}

// 缓存消息
function cacheMsg ( dseType, msg ) {
    if (_needCache[dseType]) {
        _msgCache[dseType] = msg;
    }
}

function dispatchMsg ( data ) {
    if (_handler != null) {
        _handler(data.type, data.msg);
    }
}

function onSocketMsg ( pkgType, msg ) {
    cacheMsg(pkgType, msg);

    ///TODO: 特殊的需要处理的消息
    if (_dseTypes[pkgType] != null) {
		_dseTypes[pkgType] = _dseTypes[pkgType] - 1;
		if (_dseTypes[pkgType] === 0) {
			_dseTypes[pkgType] = null;
        }

		///TODO: 清除网络屏蔽层
    }

    const data = {
        type: pkgType,
        msg: msg,
    };
    dispatchMsg(data);
}

function checkMsg ( dceType ) {
    let dseType = _filterOnce[dceType];
    if (dseType == null) {
        dseType = _filterNewDay[dceType];
    }

    if (dseType != null) {
        return [_msgCache[dseType], dseType];
    }

    return [null, null];
}

const MessageCache = cc.Class({
    name: "MessageCache",

    properties: {
        _manager: null,
    },
    
    sendRequest: function ( dceType, data, onlySend, force, delayShow ) {
        // noinspection JSAnnotator
		const values = checkMsg(dceType);
		const msg = values[0];
		const dseType = values[1];
        if (msg != null && !force) {
            ///TODO: Schedule
			// Scheduler.scheduleOnce( dispatchMsg, 0.01, {type = dseType, msg = msg})；
        } else {
            ///TODO: 添加网络loading界面
			// if not onlySend then
            //     local dseType = _pkgMap:GetDesTypeByDceType(dceType) or getSpecialDceToDse( dceType )
            //     if dseType then
            //     _dseTypes[dseType] = 1 + (_dseTypes[dseType] or 0)
            // else
            //     error("\n\n***ERROR*** " .. _pkgMap:GetDescriptorName( dceType ) .. " dosen't mapped ID_Dse ***ERROR***")
            //     end
            //
            //     NetLoadingViewLogic.show( delayShow )
            // end

			// HeartBeatManager.tryHeartBeat();    ///TODO: 添加心跳处理
			this._manager._sendRequest(dceType, data);
        }
	},
    
    deleteMsgCache: function ( dseType ) {
        _msgCache[dseType] = null;
	},

	setNetHandler: function ( manager, handler, netProxy ) {
        init();
        _handler = handler;
        this._manager = manager;
        netProxy.setNetHandler(onSocketMsg);
	},

    clearDseTypes: function () {
        _dseTypes = {};
	},

    onReconnectNet: function () {
        ///TODO: 添加重连上报
	},
});

const messageCache = new MessageCache();
module.exports = messageCache;