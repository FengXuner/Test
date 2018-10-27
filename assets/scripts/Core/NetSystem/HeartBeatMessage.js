/**
 * @module  HeartBeatMessage
 * @info    心跳和服务器时间模块
 * @author  baofeng
 * @date    2018-10-12
 */

/* 局部常量 */
const DELTA = 10;
const DEVIATION = 60;

/* 局部变量 */
let globalTime = null;
let localTime  = null;
let serverTime = null;
let _timeEvent = {};
let _init = false;
let _lastHeartBeat = 0;

/* 局部函数 */
function getCurTime (  ) {
	const date = new Date();
	return date.getTime();
}

function getCurMilTime (  ) {
	const time = getCurTime();
	return time / 1000;
}

function tryDispatchEvent () {
	const time = Math.floor(globalTime);
	const events = _timeEvent[time];
	if (events != null) {
		// for (let i in events) {
		// 	if
		// }
	}
}

function update ( data, delta ) {
	if (serverTime != null) {
		const now = getCurTime();
		globalTime = serverTime + now - localTime;
	}
}

function init (  ) {
	if (!_init) {
		_init = true;
		///TODO: 添加update函数处理
	}
}

function onHeartBeat ( pkg ) {
	if (pkg != null && pkg.time != null) {
		init();

		const newTime = pkg.time;
		if (globalTime == null) {
			globalTime = newTime;
		}
		///TODO: set _oldDay

		_lastHeartBeat = newTime;
		
		if (globalTime != null && newTime < globalTime && globalTime - newTime < DEVIATION) {
			return;
		}

		serverTime = newTime;
		globalTime = serverTime;
		localTime = getCurMilTime();
	}
}

const HeartBeatMessage = cc.Class({
    name: "HeartBeatMessage",

    properties: {
        _time: 0,
		_entryId: null,
    },

	ctor: function () {
		this.NetMessageSystem = require('NetMessageSystem');
	},

    getNowTime: function () {
    	const time = getCurTime();
		return Math.floor(time / 1000);
	},

	heartBeat: function () {
        const now = this.getNowTime();
        if (now === this._time > DELTA || now - this._time < 0) {
            this._time = now;
            this.init();
			this.NetMessageSystem._sendRequest(ID_DceHeartbeat, {});
        }
	},

	initNetListener: function () {
		this.NetMessageSystem.registerMessageListener(ID_DseHeartbeat, onHeartBeat);
	},

	uninitNetListener: function () {
		this.NetMessageSystem.unregisterMessageListener(ID_DseHeartbeat, onHeartBeat);
	},
});

const heartBeatMessage = new HeartBeatMessage();
module.exports = heartBeatMessage;