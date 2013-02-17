/**
 * Connection Class Stub
 *
 * @author      Markus M. May
 * @website     http://www.javafreedom.org
 * @copyright   Markus M. May 2013
 */
var util = require('util');

Connection = exports.Connection = function() {
    this.name = "TestStub";
    this.readyState = "open";
};

util.inherits(Connection, process.EventEmitter);

// just a method stub
Connection.prototype.close = function() {
    this.readyState = "closed";
};

Connection.prototype.write = function(message, encoding) {
    this.message = message;
};