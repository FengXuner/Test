/**
 * @class   NetTest
 * @extends Component
 * @info    网络测试模块
 * @author  baofeng
 * @date    2018-10-08
 */

var $root = require("proto");

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {

    },

    start: function () {
        var AchievementData = $root.AchievementData;

        var data = {id: 1,
                    count: "2",
                    rewardtime: 16};

        var errMsg = AchievementData.verify(data);
        if (errMsg) {
            throw Error(errMsg);
        }

        var message = AchievementData.create(data);
        var buffer = AchievementData.encode(message).finish();
        logD(buffer);
        var pkg = AchievementData.decode(buffer);
        logD("%o", pkg);
        var object = AchievementData.toObject(pkg);
        logD("%o", object);
    },

    update: function (dt) {

    },
});
