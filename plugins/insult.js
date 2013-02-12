/**
 * Insult Plugin
 *
 * @author		Markus M. May
 * @website		http://www.javafreedom.org
 * @copyright	Markus M. May 2013
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
	Plugin.super_.call(this, irc, name);

	this.title = 'Insult';
	this.version = '0.1';
	this.author = 'Markus M. May';

    this.irc.addTrigger(this, 'insult', this.trigInsult);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.trigInsult = function(msg) {
	var irc = this.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
    if (typeof params[0] === 'undefined') {
        chan.send('\002Example:\002 ' + irc.config.command + 'insult <nick>');
    } else {
        this.irc.send(c, params[0] 
            + ' is slapped with a trout');
    }
};