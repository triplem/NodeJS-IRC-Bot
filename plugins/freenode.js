/**
 * FreeNode Services Plugin
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 *
 * Identifies to nickserv on FreeNode onConnect
 *      update nickPass as needed
 */
var sys = require('util');

Plugin = exports.Plugin = function( irc ) {
  this.name = 'freenode';
  this.title = 'FreeNode Services';
  this.version = '0.1';
  this.author = 'Karl Tiedt';

  this.nickPass = 'password';

  this.irc = irc;
};

Plugin.prototype.onConnect = function() {
  this.irc.raw('NS id ' + this.nickPass);
};