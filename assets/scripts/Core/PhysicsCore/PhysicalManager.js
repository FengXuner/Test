/**
 * @class PhysicalManager
 * @extends Component
 * @info 物理系统相关参数设置
 *          1: 系统开关
 *          2: 物理调试信息绘制
 * @writter baofeng
 * @data 20180928
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        physicsEnable: {
            default: PHY_SWITCH,
            tooltip: "指定是否启用物理系统",
            displayName: "Enable Physice",
        },

        shapeBit: {
            default: PHY_DRAW_SHAPE,
            tooltip: "指定是否绘制形状",
            displayName: "Show Shape",
        },

        jointBit: {
            default: PHY_DRAW_JOINT,
            tooltip: "指定是否绘制关节链接信息",
            displayName: "Show Joint",
        },

        // aabbBit: {
        //     default: PHY_DRAW_AABB,
        //     tooltip: "指定是否绘制包围盒",
        //     displayName: "Show AABB",
        // },

        // pairBit: {
        //     default: PHY_DRAW_PAIR,
        //     tooltip: "指定是否绘制pair",
        //     displayName: "Show Pair",
        // },
        
        // centerOfMassBit: {
        //     default: PHY_DRAW_CENTEROFMASS,
        //     tooltip: "指定是否绘制centerOfMass",
        //     displayName: "Show CenterOfMass",
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.manager = cc.director.getPhysicsManager()
    },

    onLoad: function () {
        this.restorePhysicsEnable();
        this.restorePhysicsDrawFlag();
    },

    start: function () {

    },

    update: function (dt) {

    },

    // FUNCTIONS:
    restorePhysicsEnable: function () {
        this.manager.enabled = this.physicsEnable;
    },

    restorePhysicsDrawFlag: function () {
        var value = 0;
        if (this.physicsEnable) {
            if (this.jointBit) {
                value = value | cc.PhysicsManager.DrawBits.e_jointBit;
            }

            if (this.shapeBit) {
                value = value | cc.PhysicsManager.DrawBits.e_shapeBit;
            }

            // if (this.aabbBit) {
            //     value = value | cc.PhysicsManager.DrawBits.e_aabbBit;
            // }

            // if (this.pairBit) {
            //     value = value | cc.PhysicsManager.DrawBits.e_pairBit;
            // }

            // if (this.centerOfMassBit) {
            //     value = value | cc.PhysicsManager.DrawBits.e_centerOfMassBit;
            // }

            this.manager.debugDrawFlags = value;
        }
    },
});
