/**
 * @module  RequireCore
 * @info    框架文件信息
 * @author  baofeng
 * @date    2018-10-09
 */
const _AllCore = [
	// Event
	"EventSystem",

	// Net
	"NetSystemTypes",
    // "NetProxy",
	// "LoginAuth",
	"SocketProxy",
	"NetMessageSystem",
	"HeartBeatMessage",
	"MessageCache",

	// ProtoCore
    "PkgMap",

	// Utils
    // "LogHelper",
	"Scheduler",
];

module.exports = {
    AllCore: _AllCore,
};