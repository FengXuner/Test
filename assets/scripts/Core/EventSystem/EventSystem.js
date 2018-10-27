/**
 * @module  EventSystem
 * @info    消息系统
 * @author  baofeng
 * @date    2018-10-15
 */

/* 局部变量 */
let _eventListenerCache = {};

/* 局部函数 */
function cacheListener ( eventType, callback, priority ) {
	if (_eventListenerCache[eventType] === null) {
		_eventListenerCache[eventType] = {};
		for (let key in PRIORITY_LEVEL) {
			_eventListenerCache[eventType][key] = [];
		}
	}

	const caches = _eventListenerCache[eventType][priority === null ? PRIORITY_LEVEL.NORMAL : priority];
	for (let i in caches) {
		if (caches[i] === callback) {
			return false;
		}
	}

	caches.push(callback);
	return true;
}

const EventSystem = cc.Class({
	name: 'EventSystem',

	registerEventListener: function ( eventType, callback, priority ) {
		if (callback === null) {
			logE("\n\n***ERROR*** callback is nil  ***ERROR***");
		}

		if (cacheListener(eventType, callback, priority)) {
			log("EventSystem: registered event " + eventType + " success");
		} else {
			log("EventSystem: cannot repeat registered event " + eventType);
		}
	},

	unregisterEventListener: function ( eventType, callback, priority ) {
		if (eventType === null) {
			logE("\n\n####### EVENT_TYPE is nil #######\n");
		}

		if (callback === null) {
			logE("\n\n####### callback is nil #######\n");
		}

		const caches = _eventListenerCache[eventType];
		if (caches === null) {
			log("EventSystem: nothing has registered with " + eventType);
			return;
		}

		const callbacks = caches[priority === null ? PRIORITY_LEVEL.NORMAL : priority];
		let index = callbacks.indexOf(callback);
		if (index > -1) {
			callbacks.splice(index, 1);
			log("EventSystem: unregisterMessage " + messageType + " success");
		} else {
			log("EventSystem: has not registered with " + messageType);
		}
	},

	dispatchEvent: function ( eventType, data ) {
		const caches = _eventListenerCache[eventType];
		if (caches != null) {
			for (let key in caches) {
				for (let i in caches) {
					caches[key][i](data);
				}
			}
		}
	},
});

const eventSystem = new EventSystem();
module.exports = eventSystem;