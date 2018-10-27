/**
 * @class   Main
 * @extends Component
 * @info    脚本部分入口
 * @author  baofeng
 * @date    2018-09-30
 */
const startGame = require('StartGame');

cc.Class({
    extends: cc.Component,

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {

    },

    start: function () {
        startGame.gameStart();
    },

    update: function (dt) {

    },
});