/**
 * @class   BaseLogic
 * @info    Logic的基类
 * @author  baofeng
 * @date    2018-10-17
 */
/***** Extenal Ref *****/
const NetMessageSystem = require('NetMessageSystem');
const EventSystem = require('EventSystem');

const VIEW_STATE = {
	OPEN: 0,
	CLOSE: 1,
};

/***** Local Ver *****/
let _logicId = 0;

/***** Local Fun *****/
function registerCallBack( messageType, listener, priority, obj, logMsg ) {
	let closure_callback = function ( data ) {
		listener(this, data);
	}.bind(this);

	let caches = obj[messageType];
	if (caches === undefined) {
		obj[messageType] = {};
	}
	else {
		for (let key in caches) {
			if (caches[key].lis === listener) {
				logD(logMsg);
				return;
			}
		}
	}

	caches.push({closure: closure_callback, lis: listener, priority: priority});
}

function realRegisterNetListener( self ) {
    for (let key in self.netListenerCache) {
        for (let i in self.netListenerCache[key]) {
            const listener = self.netListenerCache[key][i];
            NetMessageSystem.registerMessageListener(key, listener.closure, listener.priority);
        }
    }
}

function realUnRegisterNetListener( self ) {
	for (let key in self.netListenerCache) {
		for (let i in self.netListenerCache[key]) {
			const listener = self.netListenerCache[key][i];
			NetMessageSystem.unregisterMessageListener(key, listener.closure, listener.priority);
		}
	}
}

function realRegisterWebListener( self ) {
    ///TODO: WebMessageSystem
}

function realUnRegisterWebListener( self ) {
	///TODO: WebMessageSystem
}

function realRegisterEventListener( self ) {
	for (let key in self.eventListenerCache) {
		for (let i in self.eventListenerCache[key]) {
			const listener = self.eventListenerCache[key][i];
			EventSystem.registerEventListener(key, listener.closure, listener.priority);
		}
	}
}

function realUnRegisterEventListener( self ) {
	for (let key in self.eventListenerCache) {
		for (let i in self.eventListenerCache[key]) {
			const listener = self.eventListenerCache[key][i];
			EventSystem.unregisterEventListener(key, listener.closure, listener.priority);
		}
	}
}

/***** BaseLogic *****/
const BaseLogic = cc.Class({
    extends: cc.Component,

    properties: {
        _logicId: 0,
		__newed: false,
        pos: cc.Vec2.ZERO,
        size: cc.Size.ZERO,
        childLogics: [],
        netListenerCache: {
        	default: {},
		},
        webListenerCache: {
			default: {},
		},
        eventListenerCache: {
			default: {},
		},
        covered: {
			default: {},
        },
		fullScreen: true,
		customParent: null,
		customParentLogic: null,
		viewState: VIEW_STATE.CLOSE,
    },

	ctor: function () {
		this.covered = {
			visible: true,
		};
	},

    getLogicId: function () {
        return this._logicId;
	},

    _privateInit: function () {

	},

    autoInit: function () {
		this.__newed = true;
		_logicId += _logicId;
		this._logicId = _logicId;
		this.childLogics = [];
		this.netListenerCache = {};
		this.webListenerCache = {};
		this.eventListenerCache = {};
		this.covered = {
			visible: true,
		};
	},

    initNetListener: function () {

	},

    initWebListener: function () {

	},

    initEventListener: function () {

	},

    uninitNetListener: function () {

	},

    uninitWebListener: function () {

	},

    uninitEventListener: function () {

	},

    registerNetListener: function ( messageType, listener, priority ) {
		registerCallBack(messageType, listener, priority, this.netListenerCache,
            "BaseLogic.registerNetListener: cannot repeat registered message");
	},

    registerWebListener: function ( messageType, listener, priority ) {
		registerCallBack(messageType, listener, priority, this.webListenerCache,
			"BaseLogic.registerWebListener: cannot repeat registered web message");
	},

    registerEventListener: function ( messageType, listener, priority ) {
		registerCallBack(messageType, listener, priority, this.eventListenerCache,
			"BaseLogic.registerEventListener: cannot repeat registered event");
	},

    sendRequest: function ( msgType, data, onlySend, force, delayShow ) {
		NetMessageSystem.sendRequest(msgType, data, onlySend, force, delayShow);
	},

    sendWebRequest: function ( msgType, data, onlySend, autoRetry ) {
        ///TODO: WebMessageSystem
	},

	postEvent: function ( event, data ) {
		EventSystem.dispatchEvent(event, data);
	},
    
    getView: function () {
        logE(("\n*****  ERROR  getView() should be override  ERROR  *****"));
        return null;
	},

	setVisible: function () {
        this.getView().active = false;
	},

    retain: function () {

	},

    release: function () {

	},

    isVisible: function () {
        return this.getView().active;
	},

    setScale: function ( x, y ) {
    	const scaleX = x === null ? 1 : x;
		const scaleY = y === null ? 1 : y;
		this.getView().setScale(cc.v2(scaleX, scaleY));
	},

	isFullScreen: function (  ) {
		return this.fullScreen;
	},

	setCovered: function ( visible ) {
		if (visible) {
			this.setVisible(this.covered.visible);
		}
		else {
			this.covered.visible = this.isVisible();
			this.setVisible(false);
		}
	},

	addToParent: function ( parent, parentLogic ) {
		this.customParent = parent;
		if (parent !== null) {
			parent.addChild(this.getView());
			this.customParentLogic = parentLogic;
			parentLogic.addChildLogic(this);
		}
		else {
			///TODO: 在最上层显示
		}
	},

	beTop: function (  ) {

	},

	beNotTop: function () {

	},

	__openView: function ( parent, parentLogic ) {
		if (!this.__newed) {
			logD("===========   WARNNING: Logic should run the 'new()' function   ===========");
		}

		this.initNetListener();
		this.initWebListener();
		this.initEventListener();

		realRegisterNetListener(this);
		realRegisterWebListener(this);
		realRegisterEventListener(this);
	},

	openView: function ( parent ) {

	},

	__closeView: function () {
		this.unscheduleAllCallbacks();

		realUnRegisterEventListener(this);
		realUnRegisterWebListener(this);
		realUnRegisterNetListener(this);

		this.uninitEventListener();
		this.uninitWebListener();
		this.uninitNetListener();

		///TODO: _createIns_
	},

	closeView: function () {

	},

	refreshView: function ( data ) {
		this.onRefresh(this.getView(), data);
	},
	
	isOpen: function () {
		return this.viewState === VIEW_STATE.OPEN;
	},

	onFirstOpen: function ( view ) {

	},

	onOpen: function ( view ) {

	},

	onClose: function ( view ) {

	},

	onRefresh: function ( view, data ) {

	},

	setPosition: function ( pos ) {
		this.pos = pos;
		if (this.isOpen()) {
			this.getView().setPosition(pos);
		}
	},

	getPosition: function () {
		return this.pos;
	},

	getContentSize: function () {
		return this.size;
	},

	addChild: function ( child ) {
		this.getView().addChild(child);
	},

	getParent: function () {
		return this.getView().getParent();
	},

	addChildLogic: function ( logic ) {
		this.childLogics[this.childLogics.length] = logic;
	},

	removeChildLogic: function ( logic ) {
		let index = this.childLogics.indexOf(logic);
		if (index > -1) {
			this.childLogics.splice(index, 1);
		}
	},

	clearChildLogic: function () {
		for (let i in this.childLogics) {
			this.childLogics[i].closeView();
		}

		this.childLogics.length = 0;
	},
});

module.exports = BaseLogic;