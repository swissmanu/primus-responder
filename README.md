# Primus Responder

Client and server plugin that adds a request/response cycle to (Primus)[https://github.com/3rd-Eden/primus] if needed.

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
		console.log('Reponse from spark:' response);
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
