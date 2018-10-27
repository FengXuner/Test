/**
 * @class SocketProxy
 * @extends NetProxy
 * @info Socket代理
 *          这里使用WebSocket
 * @writter baofeng
 * @data 20180928
 */

const NetSystemTypes = require('NetSystemTypes');
const ERROR_CODE = NetSystemTypes.ERROR_CODE;
const SOCKET_STATE = NetSystemTypes.SOCKET_STATE;

const CONNECT_TIME_LIMIT = 20;
const RETRY_MAX_COUNT = 4;
const RECONNECT_MAX = 10;

const SocketProxy = cc.Class({
	extends: require('NetProxy'),

	ctor: function () {
		this._socket = null;
		this._receiveState = false;
		this._socketState = SOCKET_STATE.NONE;
		this._connectTime = 0;
		this._retryCount = 0;
		this._receiveBuffer = "";
		this.LoginAuth = require('LoginAuth');
		this.HeartBeatMessage = require('HeartBeatMessage');
	},

	receive: function (buffer) {
		logD("on receive.");
		const headLen = 8;
		const data = new DataView(buffer);
		let offset = 0;
		const length = data.getInt32(offset);
		offset += 4;
		const pkgType = data.getInt16(offset);
		offset += 2;
		const index = data.getInt16(offset);
		offset += 2;

		logN("receive header. length: " + length + ", pkgType: " + pkgType + ", index: " + index);
		const response = new Uint8Array(buffer, offset);
		const cls = this._pkgMap.GetPkgByType(pkgType);
		if (cls) {
			const msg = cls.decode(response);
			logN("@@  RECEIVE MSG msgName = " + msg.toString() + " msgType = " + pkgType + " @@");
			if (this._netHandler) {
				this._netHandler(pkgType, msg);
			}
		} else {
			// logW("\n***ERROR*** SocketProxy ***ERROR***\n" + pkgType);
		}
	},

	init: function () {
		this._socketState = SOCKET_STATE.NONE;
		this._retryCount = 0;

		this.LoginAuth.init();
	},

	sendAuth: function ( msg ) {
		const len = msg.length;
		const headLen = 2;
		let buffer = new ArrayBuffer(len + headLen);
		let data = new DataView(buffer);
		data.setUint16(0, len);
		for (let i = 0; i < len; i++) {
			data.setUint8(headLen + i, msg.charCodeAt(i));
		}

		this._socket.send(buffer);

		///TODO: 统计
		//Statistics.record(Statistics.ID.LOGIN_GAME);

		logN("#####  sendAuth: " + msg + "  #####");
	},

	onSocketOpen: function (  ) {
		logN("Socket Connected.");
		this._socketState = SOCKET_STATE.CONNECTED;

		const msg = this.LoginAuth.generateAuthMsg(this.getUid(), this.getSecret());
		this.sendAuth(msg);
	},

	onSocketMessage: function ( event ) {
		const data = event.data;
		logN("Receive Msg.");
		this.receive(data);
	},

	onSocketError: function ( event ) {
		// const data = event.data;
		logN("Receive Error.");
		this.endNet(true);
	},

	onSocketClose: function (  ) {
		logN("Socket Closed.");
		this.endNet();
		if (this._errorHandler) {
			this._errorHandler("closed");
		}
	},

	connect: function () {
		if (this._socketState === SOCKET_STATE.NONE) {
			const url = "ws://" + this._ip + ":" + this._port;
			// const url = "ws://echo.websocket.org";
			this._socket = new WebSocket(url);
			this._socket.binaryType = "arraybuffer";

			const self = this;
			this._socket.onopen = function ( event ) {
				self.onSocketOpen();
			};
			this._socket.onclose = function ( event ) {
				self.onSocketClose();
			};
			this._socket.onmessage = function ( event ) {
				self.onSocketMessage(event);
			};
			this._socket.onerror = function ( event ) {
				self.onSocketError(event);
			};

			this._socketState = SOCKET_STATE.CONNECTING;
			this._connectTime = this.HeartBeatMessage.getNowTime();
			logN("connect to ip: " + this._ip + ", port: " + this._port);
			logN("connect time is " + this._connectTime);

			///TODO: 添加网络loading界面
		}
	},

	tryReconnect: function () {
		if (this._socketState !== SOCKET_STATE.NONE) {
			return;
		}

		if (this._retryCount < RETRY_MAX_COUNT) {
			this.connect();
			this._retryCount++;
		} else {
			if (this._errorHandler) {
				this._errorHandler(ERROR_CODE.CANNOT_CONNECT);
			}
		}
	},

	startNet: function (ip, port, pkgMap) {
		this.initProxy(ip, port, pkgMap);
		this.init();
		this.connect();
	},

	endNet: function (reconnect) {
		///TODO: 清除网络屏蔽层
		if (this._socketState === SOCKET_STATE.CONNECTED || this._socketState === SOCKET_STATE.CONNECTING) {
			this._socketState = SOCKET_STATE.NONE;
			this._socket.close();
			this._socket = null;
		}

		if (reconnect) {
			this.tryReconnect();
		}
	},

	reconnectNet: function () {
		this.endNet();
	},

	restartNet: function () {
		this._retryCount = 0;
		this.reconnectNet();
	},

	checkSocket: function () {
		if (this._socket == null) {
			this.reconnectNet();
		}
	},

	checkNet: function (callback, pkg) {
		///TODO: 网络状况处理
		if (NetWorkHandler.isWorking()) {
			callback(pkg);
		} else {
			this.endNet();

			const check = function () {
				this.checkNet(callback, pkg);
			};
			///TODO: MessageBoxHelper
			//MessageBoxHelper.show(getWebLang("温馨提示"), getWebLang("没有检测到网络连接"), getWebLang("确定"), recheck);
		}
	},

	resetIP: function (ip, port) {
		if (ip !== this._ip || port !== this._port) {
			this.endNet();

			this.setIP(ip);
			this.setPort(port);

			this.connect();
		}
	},

	generateFinalPkg: function (pkg, pkgType) {
		const dataBuffer = pkg.buffer;
		const len = dataBuffer.byteLength;

		const headLen = 8;
		const buffer = new ArrayBuffer(len + headLen);

		let offset = 0;
		let data = new DataView(buffer);
		data.setUint16(offset, len + headLen - 2);
		offset += 2;
		data.setUint16(offset, pkgType);
		offset += 2;
		data.setUint32(offset, 1);
		offset += 4;
		let buf = new Uint8Array(buffer, offset);
		buf.set(dataBuffer, 0);
		logD("%o", buffer);
		return buffer;
	},

	_send: function (pkg, msgType) {
		this.checkSocket();
		logN("@@  SEND MSG msgType = " + msgType + " @@");
		const finalBuffer = this.generateFinalPkg(pkg, msgType);

		this._socket.send(finalBuffer);

		this._receiveState = true;
	},

	send: function (pkg, msgType) {
		this._send(pkg, msgType);
	},

	clear: function () {
		logN("==== ****    CLEAR SOCKET    **** ====");
		this.endNet();
	},
});

const socketProxy = new SocketProxy();
module.exports = socketProxy;