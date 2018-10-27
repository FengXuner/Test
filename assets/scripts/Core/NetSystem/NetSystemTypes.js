/**
 * @module  NetSystemTypes
 * @info    网络系统常量
 * @writter baofeng
 * @data    20180929
 */
const ERROR_CODE =
	{
		TIMEOUT: -1,
		FAILED: 404,
		SOCKET_CLOSED: "closed",
		CANNOT_CONNECT: "cannot_connect",
	};

// 连接状态 
//    0. 未初始化
//    1. 已经连接
//    2. 正在连接 
//    3. 取消连接
//   -1. 连接失败 
const SOCKET_STATE =
	{
		NONE: 0,
		CONNECTED: 1,
		CONNECTING: 2,
		CANCEL: 3,
		CONNECT_FAILED: -1,
	};

module.exports = {
    ERROR_CODE: ERROR_CODE,
    SOCKET_STATE: SOCKET_STATE,
};
