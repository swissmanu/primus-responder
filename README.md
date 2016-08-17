# Primus Responder

Client and server plugin that adds a request/response cycle to [Primus](https://github.com/3rd-Eden/primus).

[![Build Status](https://travis-ci.org/swissmanu/primus-responder.png)](https://travis-ci.org/swissmanu/primus-responder) [![NPM version](https://badge.fury.io/js/primus-responder.png)](http://badge.fury.io/js/primus-responder)

## Installation

	$ npm install primus-responder --save

## Use cases

* Wrap existing REST API into a realtime websocket connection
* Simplify program flow if waiting on a specific response is needed

## Usage

### On the server

```javascript
var Primus = require('primus')
	, PrimusResponder = require('primus-responder')
	, server = require('http').createServer()
	, options = { transformer: 'websockets' }
	, primus = new Primus(server, options);

primus.use('responder', PrimusResponder);

primus.on('connection', function(spark) {

	// Handle incoming requests:
	spark.on('request', function(data, done) {
		// Echo the received request data
		done(data);
	});

	// Request a response from the spark:
	spark.writeAndWait('request from server', function(response) {
		// Write the sparks response to console
		console.log('Reponse from spark:' + response);
	});

});

server.listen(8080);
```

### On the client

```javascript
var primus = Primus.connect('ws://localhost:8080');

// Handle incoming requests:
primus.on('request', function(data, done) {
	// Echo the received request data
	done(data);
});

// Request a response from the server:
primus.writeAndWait('request from client', function(response) {
	// Write the servers response to console
	console.log('Response from server:', response);
});
```

## API
### Server
#### spark#on('request', fn)
Registers an event handler for incoming requests. The handler has two arguments: `fn(data, done)`

* `data` contains the data which was sent with the request
* `done` is a callback function. First and only argument contains the data you want to transmit.

```javascript
spark.on('request', function(data, done) {
	done('this is the response');
});
```

#### spark#writeAndWait(data, fn)
Sends `data` to the given spark. As soon as the response from the spark arrives, `fn` is called with the sparks response as first and only argument.

```javascript
spark.writeAndWait('request data', function(response) {
	console.log('spark responded:', response);
});
```

### Client
#### primus#on('request', fn)
Registers an event handler for incoming requests. The handler has two arguments: `fn(data, done)`

* `data` contains the data which was sent with the request
* `done` is a callback function. First and only argument contains the data you want to transmit.

```javascript
primus.on('request', function(data, done) {
	done('this is the response');
});
```

#### primus#writeAndWait(data, fn)
Sends `data` to the connected server. As soon as the response arrives, `fn` is called with the servers response as first and only argument.

```javascript
primus.writeAndWait('request data', function(response) {
	console.log('server responded:', response);
});
```

## Run tests

	$ npm test

## Technical overview

* http://alabor.me/articles/request-response-oriented-websockets/

![Sequence Diagram](http://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgUHJpbXVzIFJlc3BvbmRlcgoKUmVxdWVzdGVyLT4AFwYAEwlBOiB3cml0ZUFuZFdhaXQoZGF0YSwgcgA2BXNlQ2FsbGJhY2spOwoAKBAANhRTYXZlIGMALQcAECJCOiBTZW5kIHIAgRgGIGVudmVsb3BlAFwQQi0-IgAdByIgRXZlbnQ6IEVtaXQKAAcFIEhhbmRsZXIAEhMAFAYAFxAAdBJkb25lKACBbAhEYXRhAIFeEkIAgVsVAIE4BgCCJgYAgSYZAIIWFU1hcCByZXBzADUFd2l0aCBvcmlnaW5hbACCBwgAgl8TAIM-CTogRXhlY3V0ZQB0CgCCbgkg&s=qsd)

## License

Copyright (c) 2013 Manuel Alabor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/ee2fdab579aeb924bad0df6e6f6beeee "githalytics.com")](http://githalytics.com/swissmanu/primus-responder)
