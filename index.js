var PrimusResponder = require('./lib');

exports.server = function server(primus, options) {
  primus.$ = primus.$ || {};
  primus.$.PrimusResponder = PrimusResponder;
  PrimusRooms(primus, options);
};

exports.PrimusResponder = PrimusResponder;
