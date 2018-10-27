/**
 * @class   LoginAuth
 * @info    登陆鉴权模块
 * @author  baofeng
 * @date    2018-10-09
 */
const ServerConfig = require('ServerConfig');
const HeartBeatMessage = require('HeartBeatMessage');

function onAuth ( pkg ) {
	if (pkg.pass === true) {
		///TODO: 增加RecordLogic
		log("####  Login Success !  ####");
		ServerConfig.GAME_LOGINED = true;

		HeartBeatMessage.heartBeat();

		///TODO: 统计登陆成功事件
	} else {
		///TODO: 增加RecordLogic
		logD("####  Login Error ! code : " + pkg.type + "  ####");
		if (pkg.type === 1) {
			// 登陆验证失败，禁止重新连接
			///TODO: 增加CommonDialogViewLogic
		} else if (pkg.type === 2) {
			// 封停
			///TODO: 增加showTips
		}
	}
}

const LoginAuth = cc.Class({
	ctor: function () {
		this.NetMessageSystem = require('NetMessageSystem');
		// this._entryId = null;
		this._dialogLogic = null;
	},

	generateAuthMsg: function ( uid, secret ) {
		return "a," + uid + "," + secret;
	},

	init: function () {
		///TODO: 网络消息回调注册
		this.NetMessageSystem.registerMessageListener(ID_DseAuthState, onAuth);
	},
});

const loginAuth = new LoginAuth();
module.exports = loginAuth;