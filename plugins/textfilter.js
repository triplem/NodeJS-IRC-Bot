/**
 * Text Filter Plugin
 *
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var util = require('util'),
    basePlugin = require('./basePlugin');

Plugin = exports.Plugin = function(irc, name) {
	Plugin.super_.call(this, irc, name);

	this.title = 'Word filter';
	this.version = '0.2';
	this.author = 'Michael Owens, Markus M. May';

	this.filters = ['swine', 'politician', 'girl'];

    this.irc.addTrigger(this, 'textfilter', this.trigTextfilter);
};
util.inherits(Plugin, basePlugin.BasePlugin);

Plugin.prototype.onMessage = function(msg) {
	var irc = this.irc,
        c = msg.arguments[0], // channel name
		u = irc.user(msg.nick), // user
		m = msg.arguments[1], // message text
        disallow = false;

	for(var i = 0, z = this.filters.length; i < z; i++) {
		if (m.toLowerCase().indexOf(this.filters[i]) != '-1') {
            disallow = true;
            break;
        }
	}

    // if the bot itself uses bad language (e.g. on answering with an added word), 
    // do not send the message (do not disallow the word)
    if (u == irc.nick || m.indexOf(irc.config.command + 'textfilter') === 0) {
        disallow = false;
    }

	if (disallow) {
		irc.channels[c].send('\002' + u + ':\002 Watch your language!');
	}
};

Plugin.prototype.trigTextfilter = function(msg) {
	var irc = this.irc,
        c = msg.arguments[0],
        chan = irc.channels[c],
        m = msg.arguments[1],
        params = m.split(' ');

	params.shift();
    if (typeof params[0] === 'undefined') {
        chan.send('\002Example:\002 ' + irc.config.command + 'textfilter <command> <word>');
    } else if (params[0] === 'addword') {
        this.filters.push(params[1]);
		chan.send('The word \002' + params[1] + '\002 is no longer allowed in here!');
    } else if (params[0] === 'removeword') {
        if (this.filters.indexOf(params[1]) > -1) {
            this.filters.splice(this.filters.indexOf(params[1]));
            chan.send('The word \002' + params[1] + '\002 is now allowed again!');            
        } else {
            chan.send('The given word \002' + params[1] + '\002 is not a disallowed word!');            
        }
    }
};