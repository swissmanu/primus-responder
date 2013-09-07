/* global Primus */

var init = Primus.prototype.initialise
	, responseCallbacks = {};

function handleIncoming(response) {
	var proceed = true
		, data = response.data;

	if(data.plugin && data.plugin === 'primus-responder' && data.responseId) {
		var callback = responseCallbacks[data.responseId];

		if(callback) {
			delete responseCallbacks[data.responseId];
			callback(data.data);

			proceed = false;
		}
	}

	return proceed;
}

Primus.prototype.initialise = function() {
	this.transform('incoming', handleIncoming);
	console.log(this);
	init.apply(this, arguments);
};

Primus.prototype.writeAndWait = function writeAndWait(data, callback) {
	var guid = generateGUID()
		, envelope = {
			plugin: 'primus-responder'
			, requestId: guid
			, data: data
		};

	responseCallbacks[guid] = callback;
	this.write(envelope);
};



//
// thx! http://stackoverflow.com/a/8472700/368959
//
generateGUID = (typeof(window.crypto) != 'undefined' &&
				typeof(window.crypto.getRandomValues) != 'undefined') ?
	function() {
		// If we have a cryptographically secure PRNG, use that
		// http://stackoverflow.com/questions/6906916
		//       /collisions-when-generating-uuids-in-javascript
		var buf = new Uint16Array(8);
		window.crypto.getRandomValues(buf);
		var S4 = function(num) {
			var ret = num.toString(16);
			while(ret.length < 4){
				ret = "0"+ret;
			}
			return ret;
		};
		return (
			S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+
			S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7])
		);
	}

	:

	function() {
		// Otherwise, just use Math.random
		// http://stackoverflow.com/questions/105034
		//       /how-to-create-a-guid-uuid-in-javascript/2117523#2117523
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
			function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			}
		);
	};