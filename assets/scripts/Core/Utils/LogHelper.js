/**
 * @module  LogHelper
 * @info    日志系统
 * @author  baofeng
 * @date    2018-09-29
 */
const LogHelper = cc.Class({
	setLog: function () {
		// normal
		window.log = cc.log;

		// warning info
		window.logW = cc.warn;

		// error info, 将会打断程序的执行
		window.logE = cc.error;

		// network info
		window.logN = function (format, ...argus) {
			if (cc.sys.isNative || cc.sys.isMobile) {
				cc.log("[NetWork] " + format, ...argus);
			}
			else {
				cc.log("%c" + format, "color:green;", ...argus);
			}
		};

		// debug info
		window.logD = function (format, ...argus) {
			if (cc.sys.isNative || cc.sys.isMobile) {
				cc.log("[Debug] " + format, ...argus);
			}
			else {
				cc.log("%c" + format, "color:blue;", ...argus);
			}
		};

		///TODO: 配置CocosCreator内控制台的等级显示
	},
});

const logHelper = new LogHelper();
module.exports = logHelper;