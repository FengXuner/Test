/**
 * @module  ViewStack
 * @info    显示界面的堆栈
 * @author  baofeng
 * @date    2018-10-17
 */

/***** External Ref *****/
const Scheduler = require('Scheduler');
const EventSystem = require('EventSystem');

/***** local Const  *****/
const MAX_PREFAB_COUNT = 8;

/***** Local Var    *****/
let _init = false;
let _allViewStackCache = {};    // 缓存所有显示的界面
let _prefabNameCache = {
    name: {},
    count: 0,
};                              // 缓存已经显示的prefab
let _viewStackCache = [];       // 按照显示的层级关系缓存显示的界面

/***** Local Func   *****/
function cachePrefabName( name ) {
    if (!_prefabNameCache[name]) {
        _prefabNameCache[name] = true;
        _prefabNameCache.count += 1;
    }
}

function realCleanCache() {
    ///TODO: 清除缓存
}

function cleanCache( immediate ) {
    if (immediate) {
        realCleanCache();
    }
    else {
		Scheduler.scheduleOnce( realCleanCache, 0.01 );
    }
}

function check( viewLogic ) {
    return false;
}

function newTop() {
    _viewStackCache[_viewStackCache.length] = [];
}

function deleteTop() {
    _viewStackCache[_viewStackCache.length - 1] = null;
}

function top() {
    if (_viewStackCache.length < 1) {
        newTop();
    }

    return _viewStackCache[_viewStackCache.length - 1];
}

function backView( topLogic, isBackHome ) {
    if (topLogic.__IS_MAIN_VIEW) {
        if (!isBackHome) {
            ///TODO: 退出游戏
        }
    }
    else {
		log("backHome: logic Id = " + topLogic.getLogicId() + "   logic cname = " + topLogic.__cname);
		topLogic.onESCClicked(isBackHome);
    }
}

function onBack() {
    const topCache = top();
    const topLogic = topCache[topCache.length - 1];
    backView(topLogic);
}

function init() {
    if (!_init) {
		_init = true;
		EventSystem.registerEventListener(BACK_VIEW, onBack)
    }
}

function push( viewLogic ) {
	// 将现有的顶部界面状态置为不在顶部
    let topCache = top();
    const topLogic = topCache[topCache.length - 1];
    if (topLogic !== null) {
        topLogic.beNotTop();
    }

	// 检查新界面是否全屏显示
	// 是，则加入新的 _viewStackCache 数据层
	// 不是，则在现有数据层中加入界面
    if (viewLogic.isFullScreen()) {
        topCache = top();
        for (let key in topCache) {
            topCache[key].setCovered(false);
        }

        newTop();
    }

	// 将新界面入栈，在栈顶
    topCache = top();
    topCache[topCache.length] = viewLogic;

    ///TODO: 控制主界面按钮 和 返回按钮的显隐
}

function pop( viewLogic ) {
	// 获取栈顶界面实例
    let topCache = top();
    let topLogic = topCache[topCache.length - 1];
    if (topLogic !== undefined) {
        if (viewLogic.getLogicId() !== topLogic.getLogicId()) {
			logE("\n***ERROR*** ViewStack ***ERROR***\n topLogic Id = " + topLogic.getLogicId() + " topLogic cname = " + topLogic.__cname + "\n viewLogic Id = " + viewLogic.getLogicId() + "   viewLogic cname = " + viewLogic.__cname);
        }

        // 出栈
        topCache[topCache.length - 1] = undefined;

		// 该数据层无界面，则删掉该层
        if (topCache.length === 0) {
            deleteTop();
            topCache = top();
            for (let key in topCache) {
                topCache[key].setCovered(true);
            }
        }

		// 将当下的栈顶界面，置顶，并控制主界面按钮 和 返回按钮的显隐
        topLogic = topCache[topCache.length - 1];
		///TODO: 控制主界面按钮 和 返回按钮的显隐
        if (topLogic !== undefined) {
            ///TODO: 音乐音效
            topLogic.btTop();
        }
    }
}

/***** ViewStack *****/
const ViewStack = cc.Class({
    name: "ViewStack",

    /** 缓存打开的界面和prefab数量，清理时使用 **/
	preloadView: function ( viewLogic ) {
        _allViewStackCache[viewLogic.getLogicId()] = viewLogic;
        cachePrefabName(viewLogic.getPrefabName());
	},

    releaseAll: function () {
        for (let key in _allViewStackCache) {
            const view = _allViewStackCache[key];
            if (view !== null) {
                view.release();
            }
        }
	},

    checkClean: function ( force, immediate ) {
        logD("_prefabNameCache.count  =  " + _prefabNameCache.count);
        if (force || _prefabNameCache.count >= MAX_PREFAB_COUNT) {
			_prefabNameCache = {
				name: {},
				count: 0,
			};
			cleanCache(immediate);
        }
	},

    /** 界面的入栈和出栈 **/
    pushView: function ( viewLogic ) {
        if (check(viewLogic)) {
            return false;
        }

		log("pushView: viewLogic Id = " + viewLogic.getLogicId() + ", viewLogic cname = " + viewLogic.__cname);

        init();

        push(viewlogic);
        return true;
	},

    popView: function ( viewLogic ) {
		// 检查，不是单例，则从预加载表中移除对象
        if (!viewLogic._isSingleton) {
            _allViewStackCache[viewLogic.getLogicId()] = null;
        }

		// 检查是否需要出栈
        if (check(viewLogic)) {
            return;
        }

		log("popView: viewLogic Id = " + viewLogic.getLogicId() + ", viewLogic cname = " + viewLogic.__cname);

		// 弹出界面
		pop(viewLogic);
	},
});

const viewStack = new ViewStack();
module.exports = viewStack;