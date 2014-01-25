/* global Primus, window */


function responder() {

var init = Primus.prototype.initialise
	, responseCallbacks = {};

/** PrivateFunction: requestFulfilled
 * A scoped version of `requestFulfilled` is passed along the "request" event
 * emitted by `dispatchRequest`.
 * The requestId available in the scope is used as responseId and is sent along
 * with the `data` argument.
 *
 * Parameters:
 *     (Object) data - Data to send with the response.
 */
function requestFulfilled(data) {
	this.primus.write({
		plugin: 'primus-responder'
		, responseId: this.requestId
		, data: data
	});
}

/** PrivateFunction: dispatchRequest
 * Dispatches a request on a response. A "request" event is emitted by the
 * primus object. That event contains the request data and a scoped reference
 * on the `requestFulfilled` function. The subject which reacts on the event
 * calls `requestFulfilled` to send a response related to this request.
 *
 * Parameters:
 *     (String) requestId -  An ID which identifies the request to dispatch.
 *     (Object) data - The request data.
 */
function dispatchRequest(requestId, data) {
	var scope = {
			primus: this
			, requestId: requestId
		}
		, scopedRequestFulfilled = requestFulfilled.bind(scope);

	this.emit('request', data, scopedRequestFulfilled);
}

/** PrivateFunction: dispatchResponse
 * This dispatches a incoming response on a specific request. It expects a
 * `responseId` and searches a callback in the `responseCallbacks` object. If
 * present, it gets executed and the callback itself is deleted from
 * `responseCallbacks`.
 *
 * Parameters:
 *     (String) responseId -  An ID which identifies a callback which should be
 *                            executed as soon as a response for a specific
 *                            request arrives.
 *     (Object) data - The response data transmitted by the server.
 */
function dispatchResponse(responseId, data) {
	var callback = responseCallbacks[responseId];

	if(callback) {
		delete responseCallbacks[responseId];
		callback(data);
	}
}

/** PrivateFunction: handleIncoming
 * A Primus transformer for incoming messages. As soon as a PrimusResponder
 * related envelope is detected, the contained data is dispatched using
 * `dispatchRequest` or `dispatchResponse`.
 *
 * Parameters:
 *     (Object) message - Incoming message
 */
function handleIncoming(packet) {
	var proceed = true
		, data = packet.data;

	// Check if message contains PrimusResponder envelope
	if(data.plugin && data.plugin === 'primus-responder') {
		proceed = false;

		// Check if it is a request or a response and dispatch
		if(data.requestId) {
			dispatchRequest.call(this, data.requestId, data.data);
		} else if(data.responseId) {
			dispatchResponse.call(this, data.responseId, data.data);
		}
	}

	return proceed;
}

/** Function: initialise
 * Extending Primus initialisation code. Adds the `handleIncoming` transformer
 * to Primus' incoming transformer chain.
 */
Primus.prototype.initialise = function() {
	this.transform('incoming', handleIncoming);
	init.apply(this, arguments);
};

/** Function: writeAndWait
 * Sends the passed data to the server. As soon as PrimusResponder recieved
 * a related response, `callback` is executed.
 *
 * Example:
 *
 *     primus.writeAndWait('primusresponder test', function(response) {
 *         console.log('PrimusResponder response arrived: ' + response);
 *     });
 *
 * Parameters:
 *     (Object) data - Data to send along the request
 *     (Function) callback - Executed as soon as the response on this request
 *                           arrived.
 */
Primus.prototype.writeAndWait = function writeAndWait(data, callback) {
	var requestId = generateGUID()
		, envelope = {
			plugin: 'primus-responder'
			, requestId: requestId
			, data: data
		};

	responseCallbacks[requestId] = callback;
	this.write(envelope);
};



/* jshint latedef: false */
var generateGUID = (typeof(window) !== 'undefined' &&
				typeof(window.crypto) !== 'undefined' &&
				typeof(window.crypto.getRandomValues) !== 'undefined') ?
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
				var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			}
		);
	};

}

responder.source = [
	';(function (Primus, undefined) {',
	'if (undefined === Primus) return;',
	responder.toString(),
	'responder();',
	'})(Primus);'
].join('\n');

module.exports = responder;
