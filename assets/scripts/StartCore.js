/**
 * @class   StartCore
 * @info    启动游戏主逻辑
 * @author  baofeng
 * @date    2018-10-09
 */
const RequireAll = require('RequireAll');
const INIT_FUNC = [
	function () {
		require('HeartBeatMessage').initNetListener();
	},
];

const StartCore = cc.Class({
    realStartCore: function () {

    },

    startCore: function () {
        RequireAll.requireAll(this.realStartCore, INIT_FUNC);
	},
});

const startCore = new StartCore();
module.exports = startCore;