var _primus;

function handleIncoming(request) {
	var proceed = true
		, data = request.data;

	if(data.plugin && data.plugin === 'primus-responder' && data.requestId) {
		var requestId = data.requestId;

		_primus.emit('request', request.data, function(response) {
			_primus.write({
				plugin: 'primus-responder'
				, responseId: requestId
				, data: response
			});
		});

		proceed = false;
	}

	return proceed;
}

function PrimusResponder(primus) {
	primus.transform('incoming', handleIncoming);
	_primus = primus;
}

module.exports = PrimusResponder;