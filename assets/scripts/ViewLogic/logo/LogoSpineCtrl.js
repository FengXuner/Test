cc.Class({
    extends: cc.Component,
    editor: {
        requireComponent: sp.Skeleton
    },

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var spine = this.getComponent('sp.Skeleton');

        spine.setCompleteListener((trackEntry, loopCount) => {
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            cc.log("[track %s][animation %s] complete: %s", trackEntry.trackIndex, animationName, loopCount);
            cc.director.loadScene("login");
        });
    },

    // start: function () {

    // },

    // update: function (dt) {
        
    // },
});
