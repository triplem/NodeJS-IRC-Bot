/**
 * Dummy Plugin to test IRC functionalities
 *
 * @author       Markus M. May
 * @website      http://www.javafreedom.org
 * @copyright    Markus M. May 2013
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

    this.title = 'Dummy Plugin';
    this.version = '0.1';
    this.author = 'Markus M. May';
};

util.inherits(Plugin, basePlugin.BasePlugin)

Plugin.prototype.onNumeric = function(msg) {
    var command = msg.rawCommand;

    // 376 is end of MOTD/modes
    if (command !== '376') {
        return false;
    }

    return true;
};