/**
 *  _____ _____ _____ _____ ____  _____ __    _____ 
 * |   __|     |  |  |   __|    \|  |  |  |  |  _  |
 * |__   |   --|     |   __|  |  |  |  |  |__|     |
 * |_____|_____|__|__|_____|____/|_____|_____|__|__|
 *
 * schedula is a priority based work scheduler for javascript
 * 
 * @licence MIT
 */
(function (factory) {
	if (typeof exports === 'object' && typeof module !== 'undefined') {
		module.exports = factory(global);
	}
	else if (typeof define === 'function' && define.amd) {
		define(factory(window));
	}
	else {
		window.schedula = factory(window);
	}
}(function (window) {
	var Promise = window.Promise;
	var requestAnimationFrame = window.requestAnimationFrame;
	var setImmediate = window.setImmediate;

	var scheduleCallback;

	if (requestAnimationFrame !== void 0) {
		scheduleCallback = function scheduleCallback (callback) { 
			requestAnimationFrame(callback);
		}
	}
	else if (setImmediate !== void 0) {
		scheduleCallback = function scheduleCallback (callback) { 
			setImmediate(callback); 
		}
	}
	else if (Promise !== void 0) {
		scheduleCallback = function scheduleCallback (callback) { 
			Promise.resolve().then(callback); 
		}
	}
	else {
		scheduleCallback = function scheduleCallback (callback) { 
			setTimeout(callback, 0); 
		}
	}

	/**
	 * schedula
	 * @param  {[type]} fps
	 * @return {Object} {
	 *     flush: {function(priority)}, 
	 *     fiber: {function(priority, context, callback, length, args)}, 
	 *     budget: {getter}
	 * }
	 */
	function schedula (fps) {
		var highPriority = [];
		var lowPriority = [];

		var highPriorityLength = 0;
		var lowPriorityLength = 0;

		var budget = 1000 / (fps || 60);
		var lastTime = 0;

		function flush (priority) {
			var task;

			// high priority work
			if (priority) {
				if (highPriorityLength === 0) {
					return;
				}

				task = highPriority.shift();
			}
			// low priority work
			else {
				if (lowPriorityLength === 0) {
					return;
				}

				task = lowPriority.shift();
			}

			// context
			var ctx = task[0];

			// callback
			var cb = task[1];

			// number of arguments
			var length = task[2];

			// arguments
			var a = length === 0 ? null : task[3];

			switch (length) {
				case 0: cb.call(ctx); break;
				case 1: cb.call(ctx, a[0]); break;
				case 2: cb.call(ctx, a[0], a[1]); break;
				case 3: cb.call(ctx, a[0], a[1], a[2]); break;
				case 4: cb.call(ctx, a[0], a[1], a[2], a[3]); break;
				case 5: cb.call(ctx, a[0], a[1], a[2], a[3], a[4]); break;
				case 6: cb.call(ctx, a[0], a[1], a[2], a[3], a[4], a[5]); break;
				case 7: cb.call(ctx, a[0], a[1], a[2], a[3], a[4], a[5], a[6]); break;
				case 8: cb.call(ctx, a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]); break;
			}

			priority ? highPriorityLength-- : lowPriorityLength--;
		}

		function throttle () {
			var time = Date.now();
			var delta = time - lastTime;

			// within budget, do work now
			if (delta > budget) {
				lastTime = time - delta % budget;
				
				if (highPriorityLength !== 0) {
					flush(true);
				} 
				else if (lowPriorityLength !== 0) {
					flush(false);
				}
			}
			// exhausted budget, schedule work for later
			else if (highPriorityLength !== 0 || lowPriorityLength !== 0) {
				scheduleCallback(throttle);
			}
		}

		function push (priority, context, callback, length, args) {
			if (priority) {
				highPriority[highPriorityLength++] = [context, callback, length, args];
			}
			else {
				lowPriority[lowPriorityLength++] = [context, callback, length, args];
			}

			// throttled scheduler
			scheduleCallback(throttle);
		}

		return Object.create(null, {
			flush: {
				value: flush
			},
			push: {
				value: push
			},
			budget: {
				get: function () { return fps; },
				set: function (value) { budget = 1000 / (fps = value); }
			},
			work: {
				get: function () {
					return {
						high: highPriority,
						low: lowPriority
					}
				}
			}
		})
	}

	return schedula;
}));