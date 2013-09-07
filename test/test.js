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
		, primus
		, requestEnvelope = {
			plugin: 'primus-responder'
			, requestId: 'test'
			, data: 'test'
		}
		, responseEnvelope = {
			plugin: 'primus-responder'
			, responseId: 'test'
			, data: 'test'
		};

	beforeEach(function() {
		httpServer = http();
		primus = serverFactory(httpServer, options);
	});

	afterEach(function() {
		httpServer.close();
	});


	describe('server spark', function() {
		it('should have a writeAndWait function', function(done) {
			httpServer.listen(function() {
				primus.on('connection', function(spark) {
					expect(spark.writeAndWait).to.be.a('function');
					done();
				});
			});

			clientFactory(httpServer, primus);
		});

		it('should trigger "request" event on incoming request envelope', function(done) {
			httpServer.listen(function() {
				primus.on('connection', function(spark) {
					spark.on('request', function() {
						done();
					});
				});
			});

			var client = clientFactory(httpServer, primus);
			client.write(requestEnvelope);
		});

		it('should send response envelope with given data when request event handler executes "done()"', function(done) {
			httpServer.listen(function() {
				primus.on('connection', function(spark) {
					spark.on('request', function(data, doneCallback) {
						doneCallback(responseEnvelope.data);
					})
				})

				primus.transform('outgoing', function(packet) {
					var data = packet.data;
					expect(data).to.be.eql(responseEnvelope);
					done();
				});
			});

			var client = clientFactory(httpServer, primus);
			client.write(requestEnvelope);
		});
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