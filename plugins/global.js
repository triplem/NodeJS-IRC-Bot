/**
* Global Functionalities and Boot Up
*
* @author		Michael Owens
* @website		http://www.michaelowens.nl
* @copyright	Michael Owens 2011
*/
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
    Plugin.super_.call(this, irc, name);

	this.title = 'Global';
	this.version = '0.1';
	this.author = 'Michael Owens';
};

util.inherits(Plugin, basePlugin.BasePlugin)

Plugin.prototype.onNumeric = function(msg) {
    var command = msg.rawCommand;

    // 376 is end of MOTD/modes
    if (command !== '376') {
        this.irc.logger.info('command send does not match (376 or repl_endofmotd) - exiting', command);
        return;
    }

    this.irc.logger.info("trying to connect to channels...", msg);

    var irc = this.irc, // irc object
        userchans = irc.userchannels; // userchannels

    this.irc.logger.info('connecting to userchans: ', userchans);    

    for (var i = 0; i < userchans.length; i++) {
        var channelName = userchans[i], password;

        if (typeof(channelName) == "object") {
            password = channelName.password;
            channelName = channelName.name;
        }

        var chan = new irc.channelObj(irc, channelName, true, password);
        irc.channels[chan.name] = chan;
    }
};