/**
 * @module  EventType
 * @info    消息类型
 * @author  baofeng
 * @date    2018-10-15
 */

/***** Local Var    *****/
let EVENT_START = 0;

/***** Local Func   *****/
function getNext () {
	EVENT_START += 1;
    return EVENT_START;
}

window.BACK_VIEW = getNext();