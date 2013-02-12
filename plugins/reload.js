/**
 * Reload Plugin
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'Plugin Reloader';
	this.version = '0.1';
	this.author = 'Michael Owens';

	this.irc.addTrigger(this, 'reload', this.loadPlugin);
    this.irc.addTrigger(this, 'unload', this.unloadPlugin);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.loadPlugin = function(msg) {
	var irc = this.irc, // irc object
        c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
	irc.send(chan && chan.name || u, 'Reloading plugin: ' + params[0]);
	irc.loadPlugin(params[0]);
};

Plugin.prototype.unloadPlugin = function(msg) {
	var irc = this.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = msg.nick, // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
	irc.send(chan && chan.name || u, 'unloading plugin: ' + params[ 0]);
    irc.unloadPlugin(params[0]);
};
