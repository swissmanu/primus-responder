var debug = require('debug')('primus-responder')
	, _primus;

function handleResponseCallback(response) {
	debug('response callback triggered');

	this.spark.write({
		plugin: 'primus-responder'
		, responseId: this.requestId
		, data: response
	});
}

function handleIncoming(request) {
	debug('processing incoming message');

	var proceed = true
		, data = request.data
		, spark = this;

	if(data.plugin && data.plugin === 'primus-responder' && data.requestId) {
		debug('intercepted primus-responder related message');

		var requestId = data.requestId
			, scope = {
				spark: spark
				, requestId: requestId
			}
			, scopedCallback = handleResponseCallback.bind(scope);

		_primus.emit('request', request.data, scopedCallback);
		proceed = false;
	}

	return proceed;
}

function PrimusResponder(primus) {
	debug('initializing primus-responder');

	primus.transform('incoming', handleIncoming);
	_primus = primus;
}

module.exports = PrimusResponder;