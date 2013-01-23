/**
 * Help Plugin - Prints differnt help messages on the 
 * IRC channel (as a privmessage)
 *
 * @author		Markus M. May
 * @website		http://www.javafreedom.org
 * @copyright	Markus M. May 2013
 */
var sys = require('util');

Plugin = exports.Plugin = function(irc) {
	this.name = 'help';
	this.title = 'Help Messages';
	this.version = '0.1';
	this.author = 'Markus M. May';

	this.irc = irc;

    irc.addTrigger(this, 'help', this.trigHelp);
};

Plugin.prototype.trigHelp = function(msg) {
    sys.puts( "<trigHelp called " + msg)
	
    var irc = this.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
    sys.puts("params: " + params[0]);
    if (typeof params[0] == 'undefined') {
        chan.send('\002Available Plugins:\002');
        for(var name in irc.plugins) {
            var plugin = irc.plugins[name];
            chan.send('Plugin: ' + plugin.name + ' ' + plugin.title + ' ' + plugin.version + ' ' 
                + plugin.author);
        }
    } else {
		chan.send('The word \002' + params[0] + '\002 is no longer allowed in here!');
    }
};