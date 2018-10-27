/**
 * @module  StartGame
 * @info    脚本相关初始化工作
 * @author  baofeng
 * @date    2018-09-29
 */
const logHelper = require('LogHelper');
const startCore = require('StartCore');
const NetMessageSystem = require('NetMessageSystem');

const StartGame = cc.Class({
	/**
	 * 适配原框架打印接口
	 * 也可直接使用 cc.log 和 console.log 系列打印接口
	 */
	setLog: function () {
		logHelper.setLog();
	},

    setSearchPath: function () {

    },

	main: function () {
		startCore.startCore();
	},

	gameStart: function () {
		this.setLog();
		this.setSearchPath();
		this.main();

		// NetMessageSystem.init();
		// NetMessageSystem.sendRequest(ID_DceAchievementData, null, false, false, 0);
	},
});

const startGame = new StartGame();
module.exports = startGame;