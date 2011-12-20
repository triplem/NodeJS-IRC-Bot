/**
 * Channel Class
 *
 * @author      Karl Tiedt
 * @website     http://twitter.com/ktiedt
 * @copyright
 * @author		Michael Owens
 * @website		http://www.michaelowens.nl
 * @copyright	Michael Owens 2011
 */
var sys = require('sys');

// to prevent onReply from happening more than once
var _init = false;
exports.initialize = function(irc) {
    irc.on('numeric', function(msg) {
        var command = msg.commands;

        if (command !== '353') {
            return;
        }
        var chan = msg.arguments[2],
            // replace + and @ prefixes for channel privs, we only want the nick
            nicks = msg.arguments[3].replace(/\+|@/g, '').split(' '),
            chans = that.irc.channels,
            user = null,
            allusers = that.irc.users,
            irc = that.irc;

        // TODO: support all channel prefixes - need to find proper documentation to list these
        if (!chan || chan.charAt(0) !== '#') {
            return;
        }
        chan = chans[chan];
        for(var i=0; i<nicks.length; i++) {
            user = allusers[nicks[i]];
            if (!user) {
                user = allusers[nicks[i]] = new irc.userObj(irc, nicks[i]);
            }
            user.join(chan.name);
        }
    });
};

Channel = exports.Channel = function(irc, room, join, password) {
    var that = this;

	this.irc = irc;
	this.name = room;
	this.inRoom = false;
	this.password = password;
    this.users = [];

	if (join ) {
        this.join();
    }
};

Channel.prototype.join = function() {
	var chans = this.irc.channels;

    chans[this.name] = this;
	this.irc.raw('JOIN', this.name, this.password);
	this.inRoom = true;
};

Channel.prototype.part = function(msg) {
	var user = null,
        users = [].concat(this.users),
        userCount = users.length,
        allusers = this.irc.users,
        chans = this.irc.channels;

	this.irc.raw('PART', this.name, ':' + msg);
	this.inRoom = false;

    for(var i=0; i<userCount;i++) {
        user = allusers[users[i]];
        // if user is only in 1 channel and channel is this one
        if (user.isOn(this.name)) {
            user.part(this);
        }
    }
};

Channel.prototype.send = function(msg) {
	this.irc.send(this.name, msg);
};