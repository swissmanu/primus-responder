var fs = require('fs')
	, path = require('path')
	, file = path.join(__dirname, '..', 'build', 'primus-responder.client.js')
	, library = fs.readFileSync(file, 'utf-8')
	, PrimusResponder = require('./server');

module.exports = {
	library: library
	, client: function() {}
	, server: PrimusResponder
	, PrimusResponder: PrimusResponder
};