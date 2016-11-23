var debug = require('debug')('primus-responder.spark')
	, uuid  = require('uuid');

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
  return uuid.v4();
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