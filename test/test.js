var Primus = require('primus')
	, PrimusResponder = require('../')
	, http = require('http').Server
	, expect = require('expect.js')
	, options = { transformer: 'websockets', parser: 'JSON' }
	, server;

function serverFactory(httpServer, options) {
	var primus = Primus(httpServer, options);
	primus.use('responder', PrimusResponder);

	return primus;
}

function clientFactory(httpServer, primus, port) {
	var address = httpServer.address()
		url = 'http://' + address.address + ':' + (port || address.port);

	return new primus.Socket(url);
}



describe('primus-responder', function() {

	var httpServer
		, primus;

	beforeEach(function() {
		httpServer = http();
		primus = serverFactory(httpServer, options);
	});

	afterEach(function() {
		httpServer.close();
	});


	describe('server', function() {

	});

	describe('client', function() {
		it('should have a writeAndWait function', function(done) {
			httpServer.listen(function() {
				var client = clientFactory(httpServer, primus);

				expect(client.writeAndWait).to.be.a('function');
				done();
			});

			clientFactory(httpServer, primus);
		});
	});

});