/**
 * Base64 Plugin
 *
 * @author		Shaun Walker
 * @website		http://www.theshaun.com
 * @copyright	Shaun Walker 2013
 */
var util = require('util'),
	basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
	Plugin.super_.call(this, irc, name);

	this.title = 'Base64 Encoder/Decoder';
	this.version = '0.1';
	this.author = 'Shaun Walker';

	this.seen = [];

	this.irc.addTrigger(this, 'base64e', this.trigBase64e);
	this.irc.addTrigger(this, 'base64d', this.trigBase64d);

};

Plugin.prototype.trigBase64e = function(msg) {
	var c = msg.arguments[0], // channel
		m = msg.arguments[1], // message
        chan = this.irc.channels[c], // channel object
        params = m.split(' ');

	params.shift();

	if (typeof params[0] == 'undefined') {
		chan.send('\002Example:\002 ' + this.irc.config.command + 'base64e <phrase>');
	} else {
		chan.send(new Buffer(params[0]).toString('base64'));
	}
};

Plugin.prototype.trigBase64d = function(msg) {
	var c = msg.arguments[0], // channel
		m = msg.arguments[1], // message
        chan = this.irc.channels[c], // channel object
        params = m.split(' ');

	params.shift();

	if (typeof params[0] == 'undefined') {
		chan.send('\002Example:\002 ' + this.irc.config.command + 'base64d <phrase>');
	} else {
		chan.send(new Buffer(params[0], 'base64').toString('ascii'));
	}
};