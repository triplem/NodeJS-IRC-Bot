/**
 * Admin Plugin
 *
 * @author      Markus M. May
 * @website     http://www.javafreedom.org
 * @copyright   Markus M. May 2013
 *
 * Provides some basic functionalities like changing nick
 */
var util = require('util');

Plugin = exports.Plugin = function(ph) {
    this.ph = ph;
    this.name = this.ph.name;

    this.title = 'Admin Services';
    this.version = '0.1';
    this.author = 'Markus M. May';

    this.ph.irc.addTrigger(this, 'admin', this.trigAdmin);
};

Plugin.prototype.trigAdmin = function(msg) {
    var m = msg.arguments[1], // message 
        params = m.split(' '),
        irc = this.ph.irc;

    params.shift();

    if (typeof params[0] == 'undefined') {
        chan.send('\002Example:\002 ' + this.irc.config.command + 'admin <command> <options>');
    } else {
        var seek = params[0].toLowerCase();

        if (seek === 'nick') {
            irc.raw('NICK', params[1]);            
        } else if (seek === 'join') {
            if (typeof params[1] !== 'undefined') {
                var chan = new irc.channelObj(irc, params[1], true, params[2]);
                irc.channels[chan.name] = chan;                
            }
        } else if (seek === 'part') {
            if (typeof params[1] !== 'undefined') {
                var chan = irc.channels[params[1]];
                if (typeof chan !== 'undefined') {
                    chan.part('admin requested me to leave!');
                    delete irc.channels[params[1]];                    
                }
            }
        }
    }
}