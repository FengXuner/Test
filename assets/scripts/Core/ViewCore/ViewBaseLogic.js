/**
 * @class   ViewbaseLogic
 * @extends BaseLogic
 * @info    ViewLogic的基类
 * @author  baofeng
 * @date    2018-10-18
 */

/***** External Ref *****/
const ViewStack = require('ViewStack');
const HeartBeatMessage = require('HeartBeatMessage');

/***** Local Fun *****/
function addToParent( self, parent, parentLogic ) {
    self.customParent = parent;
    if (parent !== null) {
        parent.addChild(this.getView());
        self.customParent = parentLogic;
        parentLogic.addChildLogic(this);
    }
    else if (parentLogic !== null) {
        self.customParent = parentLogic;
        parentLogic.addChildLogic(self);
    }
    else {
		///TODO: 在最上层显示
    }
}

function needLoad( self ) {
	return !self.instanceLoaded;
}

/***** ViewbaseLogic *****/
const ViewbaseLogic = cc.Class({
    extends: require('BaseLogic'),

    properties: {
        loaded: false,
		instanceLoaded: false,
    },

	_privateInit: function (  ) {

	},

    retain: function (  ) {
        this.loaded = true;
    },

    release: function (  ) {
        this.loaded = false;
    },

    preload: function (  ) {
        if (!this.loaded) {
            ViewStack.preloadView(this);
        }
    },

    openView: function ( parent, parentLogic ) {
        let logStr = "View state is already VIEW_STATE.OPEN: ";

        if (!this.isOpen()) {
        	const startTime = HeartBeatMessage.getNowTime();
            this.preload();

            this.__openView(parent, parentLogic);

            if (parentLogic === null && parent !== null) {
                parentLogic = parent.logic;
            }

            addToParent(this, parent, parentLogic);
            ///TODO: 需要重置位置？

			ViewStack.pushView(this);
			
			if (needLoad(this)) {
				this.instanceLoaded = true;
				this.onFirstOpen(this.getView());
			}

			this.onOpen(this.getView());

			if (parent === null) {
				///TODO: 新手引导
				///TODO: 音乐播放
				this.beTop();
			}

			logStr = "ViewBaseLogic.openView():  ";
			var useTime = HeartBeatMessage.getNowTime() - startTime;
        }

        log(logStr + this.getLogicId() + " parse use time: " + useTime);
	},

	onESCClicked: function ( data ) {
		this.closeView(data);
	},
	
	closeView: function ( callback ) {
		this.getView().destroy();
	},

	getView: function () {
		return this.node;
	}
});

module.exports = ViewbaseLogic;