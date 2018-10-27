/**
 * @class PhysicsBound
 * @extends Component
 * @info 设置物理活动边界和鼠标关节参数
 * @writter baofeng
 * @data 20180928
 */
 
cc.Class({
    extends: cc.Component,

    properties: {
        size: {
            default: cc.size(0, 0),
            tooltip: "指定刚体活动范围大小",
        },
        thickness: {
            default: 10,
            tooltip: "指定边框的厚度",
        },
        mouseJoint: {
            default: true,
            tooltip: "指定是否启用鼠标关节",
        },
        frequency: {
            default: 10,
            tooltip: "鼠标关节弹性系数",
        },
        dampingRatio: {
            default: 0.7,
            tooltip: "鼠标关节阻尼，表示关节变形后，恢复到初始状态收到的阻力",
        },
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        let width   = this.size.width || this.node.width;
        let height  = this.size.height || this.node.height;

        let node = new cc.Node();

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        // add mouse joint
        if (this.mouseJoint) {
            let joint = node.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;
            joint.frequency = this.frequency;
            joint.dampingRatio = this.dampingRatio;
        }
        
        var offset = this.thickness / 2;
        this._addBound(node, 0, height / 2 - offset, width, this.thickness);
        this._addBound(node, 0, -height / 2 + offset, width, this.thickness);
        this._addBound(node, -width / 2 + offset, 0, this.thickness, height);
        this._addBound(node, width / 2 - offset, 0, this.thickness, height);

        node.parent = this.node;
    },

    // FUNCTIONS:
    _addBound (node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }
});
