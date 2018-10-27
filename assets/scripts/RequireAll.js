/**
 * @class   RequireAll
 * @info    加载所有项目文件
 * @author  baofeng
 * @date    2018-10-09
 */
const PROJECT_FILE = [
	"ServerConfig",
	"ProtocolMgr",
];

const RequireAll = cc.Class({
    statics: {
		REQUIRE_UNIT: 50,
		INIT_UNIT: 5,
    },

    ctor: function () {
        this.JS_FILE = [];
    },

    init: function () {
		for (const i in PROJECT_FILE) {
			this.JS_FILE.push(PROJECT_FILE[i]);
		}

		const allCore = require('RequireCore').AllCore;
		for (const i in allCore) {
			this.JS_FILE.push(allCore[i]);
		}
	},

    requireAll: function ( callback, initFunc ) {
        this.JS_FILE.length = 0;
        this.init();

        const jsCnt = this.JS_FILE.length;
        const totalCnt = jsCnt + initFunc.length;

        for (let i in this.JS_FILE) {
        	window[this.JS_FILE[i]] = require(this.JS_FILE[i]);
		}

		for (let i in initFunc) {
			initFunc[i]();
		}
		// require('HeartBeatManager').initNetListener();
	},
});

const requireAll = new RequireAll();
module.exports = requireAll;