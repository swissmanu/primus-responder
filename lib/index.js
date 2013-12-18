'use strict';

/**
 * Module dependencies.
 */

var ResponderServer = require('./server')
  , ResponderClient = require('./client');

/**
 * Expose modules.
 */

module.exports = {
  client: function(){}
  , server: ResponderServer
  , library: ResponderClient.source
  , PrimusResponder: ResponderServer
};