var _primus;

function handleResponseCallback(response) {
	this.spark.write({
		plugin: 'primus-responder'
		, responseId: this.requestId
		, data: response
	});
}

function handleIncoming(request) {
	var proceed = true
		, data = request.data
		, spark = this;

	if(data.plugin && data.plugin === 'primus-responder' && data.requestId) {
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
	primus.transform('incoming', handleIncoming);
	_primus = primus;
}

module.exports = PrimusResponder;