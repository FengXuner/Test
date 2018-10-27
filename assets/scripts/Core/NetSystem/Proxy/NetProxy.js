/**
 * @class   NetProxy
 * @info    网络代理父类
 * @author  baofeng
 * @date    2018-09-29
 */
const ServerConfig = require('ServerConfig');

// noinspection JSAnnotator
const NetProxy = cc.Class({
	ctor: function () {
		this._ip = null;
		this._port = null;

		this._pkgMap = null;

		this._netHandler = null;
		this._errorHandler = null;
	},

	initProxy: function (ip, port, pkgMap) {
		this._ip = ip;
		this._port = port;
		this._pkgMap = pkgMap;
	},

	getCls: function (type) {
		const pkg = this._pkgMap.GetPkgByType(type);
		if (pkg === null) {
			log("Can! get package for " + type);
		}

		return pkg;
	},

	getPkgMap: function () {
		return this._pkgMap;
	},

	setIP: function (ip) {
		this._ip = ip;
	},

	setPort: function (port) {
		this._port = port;
	},

	setNetHandler: function ( handler ) {
		this._netHandler = handler;
	},

	setErrorHandler: function ( handler ) {
		this._errorHandler = handler;
	},

	getUid: function () {
		return ServerConfig.UID;
	},

	getSecret: function () {
		return ServerConfig.SECRET;
	},

	startNet: function ( ip, port, pkgMap ) {
		logE("\n***ERROR*** NetProxy.startNet() should be override ***ERROR***");
	},

	send: function ( pkg ) {
		logE("\n***ERROR*** NetProxy.send() should be override ***ERROR***");
	},

	clear: function ( pkg ) {
		log("==== ****    CLEAR   **** ====");
	},
});

module.exports = NetProxy;