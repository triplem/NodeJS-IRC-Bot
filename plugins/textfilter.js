/**
 * Text Filter Plugin
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('util');

Plugin = exports.Plugin = function(ph) {
    this.ph = ph;

	this.name = this.ph.name;

	this.title = 'Word filter';
	this.version = '0.2';
	this.author = 'Michael Owens, Markus M. May';

	this.filters = ['swine', 'politician', 'girl'];

    this.ph.irc.addTrigger(this, 'addword', this.trigAddword);
};

Plugin.prototype.onMessage = function(msg) {
	var irc = this.ph.irc,
        c = msg.arguments[0], // channel
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        disallow = false;

	for(var i = 0, z = this.filters.length; i < z; i++) {
		if (m.toLowerCase().indexOf(this.filters[i]) != '-1') {
            disallow = true;
        }
	}

    // if the bot itself uses bad language (e.g. on answering with an added word), 
    // do not send the message (do not disallow the word)
    if (u == irc.nick || m.indexOf(irc.config.command + 'addword') === 0) {
        disallow = false;
    }

	if (disallow) {
		irc.channels[c].send('\002' + u + ':\002 Watch your language!');
	}
};

Plugin.prototype.trigAddword = function(msg) {
	var irc = this.ph.irc, // irc object
	    c = msg.arguments[0], // channel
        chan = irc.channels[c], // channel object
		u = irc.user(msg.prefix), // user
		m = msg.arguments[1], // message
        params = m.split(' ');

	params.shift();
    if (typeof params[0] == 'undefined') {
        chan.send('\002Example:\002 ' + irc.config.command + 'addword <word>');
    } else {
        this.filters.push(params[0]);
		chan.send('The word \002' + params[0] + '\002 is no longer allowed in here!');
    }
};