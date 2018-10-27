/**
 * @class NetMessageSystem
 * @info 网络系统管理类
 * @writter baofeng
 * @data 20180929
 */

/* 局部变量 */
let _notParseDic = {};
let _messageListenerCache = {};	// 消息回调函数缓存
let _reconnectCount = 0;
let _netProxy = null;

/* 局部函数 */
// 错误提示
function errorHandler ( errorCode ) {

}

// 缓存回调函数
function cacheListener ( messageType, listener, priority ) {
	if (_messageListenerCache[messageType] == null) {
		_messageListenerCache[messageType] = {};

		for (let key in PRIORITY_LEVEL) {
			_messageListenerCache[messageType][PRIORITY_LEVEL[key]] = [];
		}
	}

	let caches = _messageListenerCache[messageType][priority == null ? PRIORITY_LEVEL.NORMAL : priority];
	let index = caches.indexOf(listener);
	if (index > -1) {
		return false;
	}

	caches.push(listener);
	return true;
}

// 消息编码
function generatePB ( cls, data ) {
	const errMsg = cls.verify(data);
	if (errMsg) {
		logE(errMsg);
		return null;
	}

	const message = cls.create(data);
	return cls.encode(message).finish();
}

function toObject( msgType, msg ) {
	const cls = _netProxy.getCls(msgType);
	return cls.toObject(msg);
}

function dispatchMessage( msgType, msg ) {
	_reconnectCount = 0;
	logD("%o", msg);
	logN("### msgType = " + msgType + " ###");
	const caches = _messageListenerCache[msgType];
	if (caches == null ||
		(caches[PRIORITY_LEVEL.HIGH].length === 0
		&& caches[PRIORITY_LEVEL.NORMAL].length === 0
		&& caches[PRIORITY_LEVEL.LOW].length === 0))
	{
		log("NetMessageSystem: nothing has registered with " + msgType);
		return;
	}

	let msgObject = null;
	if (_notParseDic[msgType]) {
		msgObject = msg;
	} else {
		msgObject = toObject(msgType, msg);
	}

	for (let key in caches) {
		for (let i in caches[key]) {
			caches[key][i](msgObject);
		}
	}
}

/* NetMessageSystem类 */
const NetMessageSystem = cc.Class({
	name: 'NetMessageSystem',

	properties:{
		_dialogLogic: null,
		_reconnectCount: null,
	},

	ctor: function () {
		this.MessageCache = require('MessageCache');
	},

	addNotParseMessage: function ( msgType ) {
		_notParseDic[msgType] = true;
	},

	// 网络消息回调函数相关
	registerMessageListener: function ( messageType, listener, priority ) {
		if (listener === null) {
			logE("\n\n####### listener is nil #######\n");
		}

		if (messageType === null) {
			logE("\n\n####### MESSAGE_TYPE is nil #######\n");
		}

		if (cacheListener(messageType, listener, priority)) {
			log("NetMessageSystem: registered message " + messageType + " success");
		} else {
			log("NetMessageSystem: cannot repeat registered message");
		}
	},

	unregisterMessageListener: function ( messageType, listener, priority ) {
		if (listener === null) {
			logE("\n\n####### listener is nil #######\n");
		}

		if (messageType === null) {
			logE("\n\n####### MESSAGE_TYPE is nil #######\n");
		}

		const caches = _messageListenerCache[messageType];

		if (caches == null) {
			log("NetMessageSystem: nothing has registered with " + messageType);
			return;
		}

		const listeners = caches[priority == null ? PRIORITY_LEVEL.NORMAL : priority];
		let index = listeners.indexOf(listener);
		if (index > -1) {
			listeners.splice(index, 1);
			log("NetMessageSystem: unregisterMessage " + messageType + " success");
		} else {
			log("NetMessageSystem: has not registered with " + messageType);
		}
	},

	init: function () {
		const ServerConfig = require('ServerConfig');
		const ProtocolMgr = require('ProtocolMgr');
		_netProxy = require('SocketProxy');
		this.MessageCache.setNetHandler(this, dispatchMessage, _netProxy);
		_netProxy.startNet(ServerConfig.SERVER_IP, ServerConfig.SERVER_PORT, ProtocolMgr.getPkgMap());
		_netProxy.setErrorHandler(errorHandler);
	},

	getCls: function ( type ) {
		return _netProxy.getCls(type);
	},

	_sendRequest: function ( msgType, data ) {
		const cls = this.getCls(msgType);
		logN("@@@  msgType = " + msgType + " @@@");
		if (data === null) {
			data = {}
		}

		_netProxy.send(generatePB(cls, data), msgType);
	},

	/**
	 * @param   {[number]}       msgType   [协议ID]
	 * @param   {[object]}       data      [数据]
	 * @param   {[bool]}         onlySend  [是否不显示屏蔽层  true为不显示]
	 * @param   {[bool]}         force     [对于有缓存的消息，是否忽略缓存，强制请求服务器 true为强制请求服务器]
	 * @param   {[bool]}         delayShow [是否延时显示屏蔽层 delayShow的值为延时时间(为数值)]
	 */
	sendRequest: function ( msgType, data, onlySend, force, delayShow ) {
		if (this._dialogLogic !== null) {
			return;
		}

		if (msgType === null) {
			logE("\n\n####### MESSAGE_TYPE is nil #######\n");
		}

		this.MessageCache.sendRequest(msgType, data, onlySend, force, delayShow);
	},

	reconnectNet: function () {
		if (_netProxy !== null) {
			_netProxy.reconnectNet();
		}
	},

	onRestart: function () {
		if (_netProxy !== null) {
			_netProxy.clear();
		}
	},
});

///TODO: setRestartListener

const netMessageSystem = new NetMessageSystem();
module.exports = netMessageSystem;