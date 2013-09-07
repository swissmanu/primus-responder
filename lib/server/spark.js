var debug = require('debug')('primus-responder.spark')
	, crypto = require('crypto');

/** PrivateFunction: generateGuid()
 * Generates a GUID (globally unique identifier) using node.js' crypto library.
 *
 * See also:
 * http://stackoverflow.com/questions/6906916/
 * collisions-when-generating-uuids-in-javascript
 *
 * Returns:
 *     (String)
 */
function generateGUID() {
	var buf = new Uint16Array(8);
	buf = crypto.randomBytes(8);
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

/** Function: initialise
 * Ensures that each spark has a `responseCallback` property.
 */
function initialise() {
	this.responseCallbacks = {};
}

/** Function: writeAndWait
 * Sends the passed data to the spark. As soon as PrimusResponder recieved
 * a related response, `callback` is executed.
 *
 * Example:
 *
 *     spark.writeAndWait('primusresponder test', function(response) {
 *         console.log('PrimusResponder response arrived: ' + response);
 *     });
 *
 * Parameters:
 *     (Object) data - Data to send along the request
 *     (Function) callback - Executed as soon as the response on this request
 *                           arrived.
 */
function writeAndWait(data, callback) {
	debug('write request and wait for response');

	var requestId = generateGUID()
		, envelope = {
			plugin: 'primus-responder'
			, requestId: requestId
			, data: data
		};

	this.responseCallbacks[requestId] = callback;

	this.write(envelope);
}


module.exports = {
	initialise: initialise
	, writeAndWait: writeAndWait
};