/**
 * User Class
 *
 * @author		Karl Tiedt
 * @website		http://twitter.com/ktiedt
 * @copyright	Karl Tiedt 2011
 */
var sys = require('sys');

User = exports.User = function(irc, /* fully qualified irc hostmask - nick!ident@host */ mask) {
	this.irc = irc;
    this.channels = [];
    this.passive = true;
    this.nick = '';
    this.ident = '';
    this.host = '';

    this.update(mask)
};

User.prototype.update = function(mask) {
    console.log('USER.update: ', mask);

    var match = mask.match(/([^!]+)!([^@]+)@(.+)/);

    if (!match && this.passive === true) {
        // this happens when only a nick is available IE: on join's 353 numeric
        this.nick = mask;
        this.ident = '';
        this.host = '';
    } else {
        this.passive = false;
        this.nick = match[1];
        this.ident = match[2];
        this.host = match[3];
    }
    this.nick = this.nick.replace(/\+|@/, '');
};

User.prototype.join = function(channel) {
    if (!channel) {
        console.log("FAIL USER JOIN: ", this.nick);
        return;
    }
    console.log("USER JOIN: ", this.nick, channel);
    var channels = this.channels,
        chan = this.irc.channels[channel];

    if (!this.isOn(channel)) {
        this.channels.push(channel);
        chan.users.push(this.nick);
    }
};

User.prototype.part = function(/* string or Channel object */ channel) {
    if (typeof channel === "object") {
        channel = channel.name;
    }
    if (!channel) {
        console.log("FAIL USER PART: ", this.nick);
        return;
    }
    console.log("USER PART: ", this.nick, channel);
    var channels = this.channels,
        irc = this.irc,
        allchans = irc.channels,
        allusers = irc.users,
        chan = allchans[channel];

    if (this.isOn(channel)) {
        chan.users.splice(chan.users.indexOf(this.nick), 1);
        channels.splice(channels.indexOf(channel), 1);
        if (chan.users.length === 0) {
            delete allchans[channel];
        }
    }
    if (this.channels.length == 0 && this.nick !== irc.nick) {
        delete allusers[this.nick];
    }
};

User.prototype.isOn = function(channel) {
    var chans = this.channels;

    return !(chans.indexOf(channel) === -1);
};

User.prototype.msg = function(target, msg) {
    this.irc.send(target, msg);
};

User.prototype.send = function(msg) {
	this.irc.send(this.nick, msg);
};