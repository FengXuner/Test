/**
 * @module  Scheduler
 * @info    定时器
 * @author  baofeng
 * @date    2018-10-17
 */
const Scheduler = cc.Class({
    name: "Scheduler",

	/**
	 * !#en
	 * Schedules a custom selector.<br/>
	 * If the selector is already scheduled, then the interval parameter will be updated without scheduling it again.
	 * !#zh
	 * 调度一个自定义的回调函数。<br/>
	 * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
	 * @method schedule
	 * @param {function} callback The callback function
	 * @param {Number} [interval=0]  Tick interval in seconds. 0 means tick every frame.
	 * @param {Number} [repeat=cc.macro.REPEAT_FOREVER]    The selector will be executed (repeat + 1) times, you can use cc.macro.REPEAT_FOREVER for tick infinitely.
	 * @param {Number} [delay=0]     The amount of time that the first tick will wait before execution.
	 * @example
	 * var timeCallback = function (dt) {
	 *   cc.log("time: " + dt);
	 * }
	 * this.schedule(timeCallback, 1);
	 */
    schedule: function (callback, interval, repeat, delay) {
		cc.assertID(callback, 1619);
		cc.assertID(interval >= 0, 1620);

		interval = interval || 0;
		repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
		delay = delay || 0;

		const scheduler = cc.director.getScheduler();

		// should not use enabledInHierarchy to judge whether paused,
		// because enabledInHierarchy is assigned after onEnable.
		// Actually, if not yet scheduled, resumeTarget/pauseTarget has no effect on component,
		// therefore there is no way to guarantee the paused state other than isTargetPaused.
		const paused = scheduler.isTargetPaused(this);

		scheduler.schedule(callback, this, interval, repeat, delay, paused);
	},

	/**
	 * !#en Schedules a callback function that runs only once, with a delay of 0 or larger.
	 * !#zh 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
	 * @method scheduleOnce
	 * @see Scheduler.schedule.Node#schedule
	 * @param {function} callback  A function wrapped as a selector
	 * @param {Number} [delay=0]  The amount of time that the first tick will wait before execution.
	 * @example
	 * var timeCallback = function (dt) {
	 *   cc.log("time: " + dt);
	 * }
	 * this.scheduleOnce(timeCallback, 2);
	 */
    scheduleOnce: function ( callback, delay ) {
		this.schedule(callback, 0, 0, delay);
	},

	/**
	 * !#en Unschedules a custom callback function.
	 * !#zh 取消调度一个自定义的回调函数。
	 * @method unschedule
	 * @see cc.Node#schedule
	 * @param {function} callback_fn  A function wrapped as a selector
	 * @example
	 * this.unschedule(_callback);
	 */
	unschedule (callback_fn) {
		if (!callback_fn)
			return;

		cc.director.getScheduler().unschedule(callback_fn, this);
	},

	/**
	 * !#en
	 * unschedule all scheduled callback functions: custom callback functions, and the 'update' callback function.<br/>
	 * Actions are not affected by this method.
	 * !#zh 取消调度所有已调度的回调函数：定制的回调函数以及 'update' 回调函数。动作不受此方法影响。
	 * @method unscheduleAllCallbacks
	 * @example
	 * this.unscheduleAllCallbacks();
	 */
	unscheduleAllCallbacks () {
		cc.director.getScheduler().unscheduleAllForTarget(this);
	},
});

const scheduler = new Scheduler();
module.exports = scheduler;