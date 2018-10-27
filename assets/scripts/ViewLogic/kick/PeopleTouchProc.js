/**
 * @class PeopleTouchProc
 * @extends Component
 * @info People层触摸事件的处理
 * @writter baofeng
 * @data 20180927
 */
cc.Class({
    extends: cc.Component,

    properties: {
        resetTorque: {
            default: 0,
            tooltip: "指定People被拖动时，关节的最大扭矩值",
            displayName: "Torque Reset Value",
        },
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.partName = ["Body", "Head", "LeftFoot", "RightFoot", "LeftHand", "RightHand"];
        this.torques = [];
    },

    onLoad: function () {
        // 获取关节
        this.body = this.node.getChildByName("Body");
        this.joints = this.body.getComponents(cc.MotorJoint);
        this.leftFoot = this.node.getChildByName("LeftFoot");
        this.rightFoot = this.node.getChildByName("RightFoot");

        // 为碰撞块命名
        for (const i in this.partName) {
            this.node.getChildByName(this.partName[i]).getComponent(cc.PhysicsCollider)._name = this.partName[i];
            if (i > 1) {
                this.torques[this.partName[i]] = this.joints[i - 1].maxTorque;
            }
        }

        // 触摸事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    },

    start: function () {

    },

    update: function (dt) {
        
    },

    // FUNCTIONS:
    onTouchBegan: function (event) {
        var manager = cc.director.getPhysicsManager();
        var target = event.touch.getLocation();
        
        if (cc.Camera && cc.Camera.main) {
            target = cc.Camera.main.getCameraToWorldPoint(target);
        }

        var collider = manager.testPoint( target );
        if (!collider) return;

        var body = collider.body;
        logD("name is %s", collider._name);

        switch (collider._name) {
            case "Head":
            case "Body":
            case "LeftFoot":
            case "RightFoot":
            case "LeftHand":
            case "RightHand":
                this.getJointByName("LeftFoot").maxTorque = this.resetTorque;
                this.getJointByName("RightFoot").maxTorque = this.resetTorque;
                this.getJointByName("LeftHand").maxTorque = this.resetTorque;
                this.getJointByName("RightHand").maxTorque = this.resetTorque;
                break;

            default:
                break;
        }
    },

    onTouchMove: function (event) {
        
    },

    onTouchEnd: function (event) {
        for (var key in this.torques) {
            this.getJointByName(key).maxTorque = this.torques[key];
        }
    },

    onTouchCancel: function (event) {
        this.onTouchEnd(event);
    },

    getJointByName: function (name) {
        var index = 0;
        for (var i in this.partName) {
            if (name === this.partName[i]) {
                index = i - 1;
                break;
            }
        }

        return this.joints[index];
    },
});
