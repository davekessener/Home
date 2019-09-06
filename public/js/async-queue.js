var AsyncConnection = (function ($) {
	function createNew(args) {
		var sendQueue = [],
			recvQueue = [],
			integrityQueue = [],
			lastSend;

		var defaults = {
			path: '/',
			interval: 500,
			maxResponseTime: 2000,
			receiver: undefined,
			errorHandler: undefined,
			defaultMsg: undefined
		};

		args = $.extend({}, defaults, args);

		function sendMsg(id, data) {
			var msg = { id: id};

			if(typeof data !== 'undefined') {
				msg['message'] = data;
			}

			sendQueue.push(msg);
		}

		function doSend(msg) {
			var sent = Date.now();

			integrityQueue.push(lastSend = sent);
			
//			console.log("Sending", lastSend, "command", msg, "to", args.path);
			
			$.post(args.path, msg, function (r) {
//				console.log("Received " + JSON.stringify(r) + " of " + sent);

				integrityQueue.shift();
				recvQueue.push(r);
			});
		}

		function doReceive(msg) {
			if(typeof args.receiver === 'function') {
				args.receiver(msg);
			}
		}

		function onDefault() {
			if(typeof args.defaultMsg === 'function') {
				doSend(args.defaultMsg());
			} else if(typeof args.defaultMsg !== 'undefined') {
				doSend(args.defaultMsg);
			}
		}

		function onError() {
			console.log('TIMEOUT: ' + integrityQueue[0] + ", " + (Date.now() - integrityQueue[0]) + '/' + args.maxResponseTime);

			if(typeof args.errorHandler === 'function') {
				args.errorHandler();
			}
		}

		function hasLostConnection() {
			return integrityQueue.length > 0 &&
				(Date.now() - integrityQueue[0]) > args.maxResponseTime;
		}

		function tick() {
			if(sendQueue.length > 0) {
				sendQueue.forEach(doSend);
				sendQueue = [];
			} else if(Date.now() - lastSend > args.interval) {
				onDefault();
			}

			if(recvQueue.length > 0) {
				recvQueue.forEach(doReceive);
				recvQueue = [];
			}

			if(hasLostConnection()) {
				onError();
			} else {
				setTimeout(tick, 100);
			}
		}

		lastSend = Date.now();
		tick();

		return {
			send: sendMsg
		};
	}

	return { open: createNew };
})(jQuery);

